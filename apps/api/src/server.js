import express from 'express';
import cors from 'cors';
import db, { DB_FILE, getStats, seedResult } from './db.js';
import { avatarSvg, coverSvg } from './media.js';

const PORT = Number(process.env.PORT) || 3001;
const VERSION = '1.0.0';
const PAGE_SIZE_DEFAULT = 10;
const PAGE_SIZE_MAX = 50;

// ---------------------------------------------------------------------------
// 基础工具
// ---------------------------------------------------------------------------

/** 带状态码的业务错误，交给统一错误处理输出中文提示 */
class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

/** 从数据库读取分类，建立 slug / 中文名 / id 的映射表 */
const categoryRows = db
  .prepare('SELECT id, name, slug, icon FROM categories ORDER BY sort_order ASC, id ASC')
  .all();
const categoryBySlug = new Map(categoryRows.map((row) => [row.slug, row]));
const categoryById = new Map(categoryRows.map((row) => [row.id, row]));
const categoryByName = new Map(categoryRows.map((row) => [row.name, row]));
const categoryNameOf = (slug) => categoryBySlug.get(slug)?.name ?? slug;
const categoryIconOf = (slug) => categoryBySlug.get(slug)?.icon ?? '🐾';
const categoryListText = categoryRows.map((row) => `${row.name}（${row.slug}）`).join('、');

/**
 * 把前端传来的 category 统一解析成分类 slug。
 * 兼容三种写法：slug（cat）、中文名（猫咪日常）、id（1），前端用哪种都能过滤。
 */
function resolveCategorySlug(raw) {
  if (raw === undefined || raw === null || raw === '') return null;
  const text = String(raw).trim();
  if (!text) return null;

  const matched =
    categoryBySlug.get(text) ??
    categoryByName.get(text) ??
    (/^\d+$/.test(text) ? categoryById.get(Number(text)) : undefined);

  if (!matched) {
    throw new ApiError(400, `分类不存在，可选分类有：${categoryListText}`);
  }
  return matched.slug;
}

/** 解析路径里的 id（必须是正整数） */
function parseId(raw, label) {
  const text = String(raw ?? '').trim();
  if (!/^\d+$/.test(text) || Number(text) < 1) {
    throw new ApiError(400, `${label}必须是大于 0 的整数`);
  }
  return Number(text);
}

/** 解析正整数查询参数；缺省时用默认值 */
function parsePositiveInt(raw, fallback, label) {
  if (raw === undefined || raw === null || raw === '') return fallback;
  const text = String(raw).trim();
  if (!/^\d+$/.test(text) || Number(text) < 1) {
    throw new ApiError(400, `${label}必须是大于 0 的整数`);
  }
  return Number(text);
}

/** 解析分页大小：非法报错，超过上限按上限截断（避免前端一次拉太多） */
function parsePageSize(raw) {
  const size = parsePositiveInt(raw, PAGE_SIZE_DEFAULT, '每页数量 pageSize');
  return Math.min(size, PAGE_SIZE_MAX);
}

/** LIKE 查询转义，避免用户输入 % 或 _ 变成通配符 */
const escapeLike = (text) => text.replace(/[\\%_]/g, (match) => `\\${match}`);

const readText = (value) => (typeof value === 'string' ? value.trim() : '');

function parseTags(value) {
  if (!Array.isArray(value)) return [];
  const tags = [];
  for (const item of value) {
    if (typeof item !== 'string') continue;
    const tag = item.trim().slice(0, 12);
    if (tag && !tags.includes(tag)) tags.push(tag);
    if (tags.length >= 5) break;
  }
  return tags;
}

// ---------------------------------------------------------------------------
// 数据库行 -> 接口对象（严格按 docs/api-contract.md 的字段名）
// ---------------------------------------------------------------------------

function safeParseTags(raw) {
  try {
    const parsed = JSON.parse(raw ?? '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function mapPostRow(row) {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    cover: row.cover,
    category: categoryNameOf(row.category),
    categorySlug: row.category,
    authorName: row.author_name,
    authorAvatar: row.author_avatar,
    likes: row.likes,
    commentsCount: row.comments_count ?? 0,
    tags: safeParseTags(row.tags),
    createdAt: row.created_at,
  };
}

function mapCommentRow(row) {
  return {
    id: row.id,
    postId: row.post_id,
    authorName: row.author_name,
    content: row.content,
    createdAt: row.created_at,
  };
}

function mapArticleRow(row) {
  return {
    id: row.id,
    title: row.title,
    summary: row.summary,
    content: row.content,
    cover: row.cover,
    category: categoryNameOf(row.category),
    categorySlug: row.category,
    readCount: row.read_count,
    createdAt: row.created_at,
  };
}

// 查询片段：帖子列表 / 详情都附带评论数
const POST_SELECT = `
  SELECT p.*,
         (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS comments_count
  FROM posts p`;

// ---------------------------------------------------------------------------
// Express 应用
// ---------------------------------------------------------------------------

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '256kb' }));

// 允许本地前端（Vite 5173，含其他本地端口）直接跨域访问；Vite 走代理时属于同源
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true); // curl / 服务端请求
      if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
  }),
);

// 简单访问日志，方便产品经理在终端看到接口被调用
app.use((req, res, next) => {
  const startedAt = Date.now();
  res.on('finish', () => {
    console.log(
      `[pet-api] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${Date.now() - startedAt}ms)`,
    );
  });
  next();
});

// --- 健康检查 --------------------------------------------------------------
app.get('/api/health', (req, res) => {
  const stats = getStats();
  res.json({
    ok: true,
    service: 'pet-api',
    version: VERSION,
    counts: stats,
    time: new Date().toISOString(),
  });
});

// --- 接口总览（打开浏览器访问 http://localhost:3001/api 可看到） -------------
app.get('/api', (req, res) => {
  res.json({
    name: '宠物社区 API',
    version: VERSION,
    docs: 'docs/api-contract.md',
    endpoints: [
      'GET /api/health',
      'GET /api/categories',
      'GET /api/posts?page=1&pageSize=10&category=cat&keyword=猫',
      'GET /api/posts/:id',
      'POST /api/posts',
      'POST /api/posts/:id/like',
      'GET /api/articles?category=health&page=1&pageSize=50',
      'GET /api/articles/:id',
    ],
  });
});

// --- 分类 ------------------------------------------------------------------
app.get('/api/categories', (req, res) => {
  const rows = db
    .prepare(
      `SELECT c.id, c.name, c.slug, c.icon,
              (SELECT COUNT(*) FROM posts p WHERE p.category = c.slug) AS post_count
       FROM categories c
       ORDER BY c.sort_order ASC, c.id ASC`,
    )
    .all();

  res.json({
    list: rows.map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      icon: row.icon,
      postCount: row.post_count,
    })),
  });
});

// --- 帖子列表 --------------------------------------------------------------
app.get('/api/posts', (req, res) => {
  const page = parsePositiveInt(req.query.page, 1, '页码 page');
  const pageSize = parsePageSize(req.query.pageSize);
  const categorySlug = resolveCategorySlug(req.query.category);
  const keyword = readText(req.query.keyword);

  const conditions = [];
  const params = [];

  if (categorySlug) {
    conditions.push('p.category = ?');
    params.push(categorySlug);
  }
  if (keyword) {
    conditions.push("(p.title LIKE ? ESCAPE '\\' OR p.content LIKE ? ESCAPE '\\')");
    const like = `%${escapeLike(keyword)}%`;
    params.push(like, like);
  }

  const whereSql = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const total = db.prepare(`SELECT COUNT(*) AS n FROM posts p ${whereSql}`).get(...params).n;
  const rows = db
    .prepare(
      `${POST_SELECT} ${whereSql}
       ORDER BY p.created_at DESC, p.id DESC
       LIMIT ? OFFSET ?`,
    )
    .all(...params, pageSize, (page - 1) * pageSize);

  res.json({ list: rows.map(mapPostRow), total, page, pageSize });
});

// --- 帖子详情（含评论） ----------------------------------------------------
app.get('/api/posts/:id', (req, res) => {
  const id = parseId(req.params.id, '帖子 ID');
  const row = db.prepare(`${POST_SELECT} WHERE p.id = ?`).get(id);

  if (!row) {
    throw new ApiError(404, '帖子不存在或已被删除');
  }

  const comments = db
    .prepare('SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC, id ASC')
    .all(id)
    .map(mapCommentRow);

  res.json({ ...mapPostRow(row), comments });
});

// --- 发布帖子 --------------------------------------------------------------
app.post('/api/posts', (req, res) => {
  const body = req.body && typeof req.body === 'object' ? req.body : {};

  const title = readText(body.title);
  const content = readText(body.content);
  const authorName = readText(body.authorName);

  if (!title) throw new ApiError(400, '标题不能为空');
  if (title.length < 2) throw new ApiError(400, '标题至少需要 2 个字符');
  if (title.length > 60) throw new ApiError(400, '标题不能超过 60 个字符');

  if (!content) throw new ApiError(400, '正文不能为空');
  if (content.length < 10) throw new ApiError(400, '正文至少需要 10 个字符');
  if (content.length > 5000) throw new ApiError(400, '正文不能超过 5000 个字符');

  if (!authorName) throw new ApiError(400, '昵称不能为空');
  if (authorName.length > 20) throw new ApiError(400, '昵称不能超过 20 个字符');

  if (body.category === undefined || body.category === null || body.category === '') {
    throw new ApiError(400, '请选择帖子分类');
  }
  const categorySlug = resolveCategorySlug(body.category);

  const tags = parseTags(body.tags);
  const createdAt = new Date().toISOString();
  const cover = body.cover && typeof body.cover === 'string' ? body.cover.trim() : coverSvg(categoryIconOf(categorySlug), categorySlug);
  const authorAvatar =
    body.authorAvatar && typeof body.authorAvatar === 'string' ? body.authorAvatar.trim() : avatarSvg(authorName);

  const result = db
    .prepare(
      `INSERT INTO posts
         (title, content, cover, category, author_name, author_avatar, likes, tags, created_at)
       VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?)`,
    )
    .run(title, content, cover, categorySlug, authorName, authorAvatar, JSON.stringify(tags), createdAt);

  const id = Number(result.lastInsertRowid);

  res.status(201).json({
    id,
    title,
    content,
    cover,
    category: categoryNameOf(categorySlug),
    categorySlug,
    authorName,
    authorAvatar,
    likes: 0,
    commentsCount: 0,
    tags,
    createdAt,
  });
});

// --- 点赞 ------------------------------------------------------------------
app.post('/api/posts/:id/like', (req, res) => {
  const id = parseId(req.params.id, '帖子 ID');
  const row = db.prepare('SELECT id, likes FROM posts WHERE id = ?').get(id);

  if (!row) {
    throw new ApiError(404, '帖子不存在或已被删除');
  }

  db.prepare('UPDATE posts SET likes = likes + 1 WHERE id = ?').run(id);
  res.json({ id, likes: row.likes + 1 });
});

// --- 百科列表 --------------------------------------------------------------
app.get('/api/articles', (req, res) => {
  const page = parsePositiveInt(req.query.page, 1, '页码 page');
  const pageSize = Math.min(parsePositiveInt(req.query.pageSize, PAGE_SIZE_MAX, '每页数量 pageSize'), PAGE_SIZE_MAX);
  const categorySlug = resolveCategorySlug(req.query.category);

  const conditions = [];
  const params = [];
  if (categorySlug) {
    conditions.push('a.category = ?');
    params.push(categorySlug);
  }
  const whereSql = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const total = db.prepare(`SELECT COUNT(*) AS n FROM articles a ${whereSql}`).get(...params).n;
  const rows = db
    .prepare(
      `SELECT a.* FROM articles a ${whereSql}
       ORDER BY a.created_at DESC, a.id DESC
       LIMIT ? OFFSET ?`,
    )
    .all(...params, pageSize, (page - 1) * pageSize);

  res.json({ list: rows.map(mapArticleRow), total, page, pageSize });
});

// --- 百科详情（阅读数 +1） -------------------------------------------------
app.get('/api/articles/:id', (req, res) => {
  const id = parseId(req.params.id, '文章 ID');
  const exists = db.prepare('SELECT id FROM articles WHERE id = ?').get(id);

  if (!exists) {
    throw new ApiError(404, '百科文章不存在或已下架');
  }

  db.prepare('UPDATE articles SET read_count = read_count + 1 WHERE id = ?').run(id);
  const row = db.prepare('SELECT * FROM articles WHERE id = ?').get(id);
  res.json(mapArticleRow(row));
});

// --- 404 与统一错误处理 ----------------------------------------------------
app.use((req, res) => {
  res.status(404).json({ error: '接口不存在，请检查请求路径' });
});

// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  if (error instanceof ApiError) {
    return res.status(error.status).json({ error: error.message });
  }
  if (error?.type === 'entity.parse.failed') {
    return res.status(400).json({ error: '请求体不是合法的 JSON 格式' });
  }
  if (error?.type === 'entity.too.large') {
    return res.status(413).json({ error: '请求内容过大，请精简后重试' });
  }
  console.error('[pet-api] 未处理的错误：', error);
  return res.status(500).json({ error: '服务器开小差了，请稍后再试' });
});

// ---------------------------------------------------------------------------
// 启动
// ---------------------------------------------------------------------------

const stats = getStats();

const server = app.listen(PORT, () => {
  console.log('');
  console.log('  🐾 宠物社区 API 已启动');
  console.log(`  接口地址：http://localhost:${PORT}/api`);
  console.log(`  健康检查：http://localhost:${PORT}/api/health`);
  console.log(`  数据文件：${DB_FILE}`);
  console.log(
    `  当前数据：分类 ${stats.categories} 个 / 帖子 ${stats.posts} 篇 / 评论 ${stats.comments} 条 / 百科 ${stats.articles} 篇`,
  );
  console.log(`  种子数据：${seedResult ? '本次已写入（首次启动）' : '已存在，跳过写入'}`);
  console.log('');
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`\n[pet-api] 端口 ${PORT} 已被占用。`);
    console.error('[pet-api] 可能是上一次的服务还在运行，先结束它再启动；或换端口：PORT=3002 npm start\n');
    process.exit(1);
  }
  console.error('[pet-api] 启动失败：', error);
  process.exit(1);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    console.log(`\n[pet-api] 收到 ${signal}，正在关闭服务…`);
    server.close(() => {
      try {
        db.close();
      } catch {
        // 数据库已关闭时忽略
      }
      process.exit(0);
    });
    // 兜底，避免长连接导致无法退出
    setTimeout(() => process.exit(0), 2000).unref();
  });
}
