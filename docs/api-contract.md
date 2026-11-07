# 宠物社区 API 接口契约

> 面向：前端联调同学、技术负责人。
> 维护：backend-dev　版本：v1.0　最后更新：2026-11-07
> 服务地址：`http://localhost:3001`（本机开发），前端通过 Vite 代理访问 `/api` → `http://localhost:3001`。

## 1. 基本约定

| 项目 | 说明 |
| --- | --- |
| Base URL | `http://localhost:3001` |
| 前缀 | 所有接口都以 `/api` 开头 |
| 数据格式 | 请求体、响应体均为 `application/json; charset=utf-8` |
| 字段命名 | 统一小驼峰（camelCase） |
| 跨域 | 允许 `http://localhost:*`、`http://127.0.0.1:*`（含 5173）；无 Origin 的 curl 请求也允许 |
| 时间格式 | ISO 8601 UTC，带毫秒和 `Z`，例如 `2026-11-06T23:41:00.000Z` |
| 状态码 | 查询成功 `200`；发布成功 `201`；参数错误 `400`；资源不存在 `404`；请求体过大 `413`；服务异常 `500` |
| 错误格式 | 统一 `{ "error": "中文提示" }` |

### 1.1 三个容易踩坑的字段约定

1. **`category` 是分类中文名，直接用于页面展示**（例如 `猫咪日常`）。
   帖子/百科对象额外提供 `categorySlug`（例如 `cat`），供筛选、样式或路由使用。
   **筛选参数 `?category=` 三种写法都支持**：slug（`cat`）、中文名（`猫咪日常`）、分类 id（`1`），前端用哪种都不会错。
2. **`cover` / `authorAvatar` 是内联 SVG data URI**，不依赖外网，离线也能显示，可以直接 `<img :src="post.cover">`。
   发布帖子时也允许传自定义图片 URL 作为 `cover`。
3. **`createdAt` 是 ISO 时间字符串**，前端展示前请格式化，例如：

   ```js
   new Date(post.createdAt).toLocaleString('zh-CN', { hour12: false })
   // 2026/11/7 07:41:00
   ```

### 1.2 分页规则

- `page` 默认 `1`，必须是大于 0 的整数，否则返回 `400`。
- `pageSize` 默认 `10`，必须是大于 0 的整数；**超过 50 按 50 处理**（不报错）。
- `page` 超出总页数时返回 `list: []`，`total` 仍为真实总数（前端可据此显示空状态）。
- 帖子、百科列表都按 `createdAt` 从新到旧排序。

---

## 2. 数据结构

### 2.1 Post（帖子）

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | number | 帖子 id |
| `title` | string | 标题 |
| `content` | string | 正文（纯文本，含中文标点） |
| `cover` | string | 封面图，内联 SVG data URI 或图片 URL |
| `category` | string | 分类中文名，用于展示 |
| `categorySlug` | string | 分类英文标识，用于筛选 |
| `authorName` | string | 作者昵称 |
| `authorAvatar` | string | 作者头像，内联 SVG data URI |
| `likes` | number | 点赞数 |
| `commentsCount` | number | 评论数（列表、详情一致） |
| `tags` | string[] | 标签数组，可能为空数组 |
| `createdAt` | string | 发布时间（ISO 8601 UTC） |
| `comments` | Comment[] | **仅帖子详情返回**（列表不返回） |

### 2.2 Comment（评论）

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | number | 评论 id |
| `postId` | number | 所属帖子 id |
| `authorName` | string | 评论者昵称 |
| `content` | string | 评论内容 |
| `createdAt` | string | 评论时间（ISO 8601 UTC） |

### 2.3 Article（百科文章）

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | number | 文章 id |
| `title` | string | 标题 |
| `summary` | string | 摘要（一两句话，用于列表卡片） |
| `content` | string | 正文，段落之间用 `\n\n` 分隔 |
| `cover` | string | 封面图，内联 SVG data URI |
| `category` | string | 分类中文名 |
| `categorySlug` | string | 分类英文标识 |
| `readCount` | number | 阅读数（打开详情时 +1） |
| `createdAt` | string | 发布时间（ISO 8601 UTC） |

### 2.4 Category（分类）

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | number | 分类 id |
| `name` | string | 中文名 |
| `slug` | string | 英文标识 |
| `icon` | string | 分类图标（emoji） |
| `postCount` | number | 该分类下的帖子数 |

---

## 3. 接口清单

| # | 方法 | 路径 | 说明 |
| --- | --- | --- | --- |
| 1 | GET | `/api/health` | 健康检查 |
| 2 | GET | `/api/categories` | 分类列表 |
| 3 | GET | `/api/posts` | 帖子列表（分页 / 分类 / 关键词） |
| 4 | GET | `/api/posts/:id` | 帖子详情（含评论） |
| 5 | POST | `/api/posts` | 发布帖子 |
| 6 | POST | `/api/posts/:id/like` | 点赞 |
| 7 | GET | `/api/articles` | 百科列表（分类 / 分页） |
| 8 | GET | `/api/articles/:id` | 百科详情（阅读数 +1） |
| — | GET | `/api` | 接口总览（额外提供，便于浏览器自检） |

---

## 4. 接口详情

### 4.1 健康检查

```
GET /api/health
```

无参数。返回服务状态和当前数据量，可用于前端判断后端是否就绪。

**响应示例（真实输出）**

```json
{
  "ok": true,
  "service": "pet-api",
  "version": "1.0.0",
  "counts": {
    "categories": 6,
    "posts": 24,
    "comments": 51,
    "articles": 12
  },
  "time": "2026-11-07T07:29:18.515Z"
}
```

**curl**

```bash
curl http://localhost:3001/api/health
```

---

### 4.2 分类列表

```
GET /api/categories
```

无参数。返回 6 个固定分类，按展示顺序排列。

**响应示例（真实输出）**

```json
{
  "list": [
    { "id": 1, "name": "猫咪日常", "slug": "cat", "icon": "🐱", "postCount": 5 },
    { "id": 2, "name": "狗狗生活", "slug": "dog", "icon": "🐶", "postCount": 4 },
    { "id": 3, "name": "异宠天地", "slug": "exotic", "icon": "🦎", "postCount": 3 },
    { "id": 4, "name": "健康问诊", "slug": "health", "icon": "🩺", "postCount": 4 },
    { "id": 5, "name": "科学喂养", "slug": "feeding", "icon": "🍗", "postCount": 4 },
    { "id": 6, "name": "行为训练", "slug": "behavior", "icon": "🎓", "postCount": 4 }
  ]
}
```

**curl**

```bash
curl http://localhost:3001/api/categories
```

---

### 4.3 帖子列表

```
GET /api/posts?page=1&pageSize=10&category=cat&keyword=猫砂
```

| 参数 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- |
| `page` | 否 | `1` | 页码，大于 0 的整数 |
| `pageSize` | 否 | `10` | 每页数量，1~50，超过 50 按 50 处理 |
| `category` | 否 | 全部 | 分类筛选，支持 slug / 中文名 / id |
| `keyword` | 否 | 无 | 标题或正文关键词模糊搜索 |

**响应示例（真实输出，`pageSize=2`，`cover`/`authorAvatar` 已截断）**

```json
{
  "list": [
    {
      "id": 1,
      "title": "三花猫每天早上六点整叫我起床，比闹钟还准",
      "content": "养了两年多的三花，最近一个月突然开始准点叫我。六点整跳上床，先在我脸边闻一圈……",
      "cover": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A……",
      "category": "猫咪日常",
      "categorySlug": "cat",
      "authorName": "阿菁",
      "authorAvatar": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A……",
      "likes": 236,
      "commentsCount": 2,
      "tags": ["猫咪日常", "晨间闹钟", "三花"],
      "createdAt": "2026-11-06T23:41:00.000Z"
    },
    {
      "id": 2,
      "title": "新领养的小橘猫躲沙发底下三天，终于肯出来了",
      "content": "从救助站接回来的小橘，前三天完全不出来，只在半夜偷偷吃粮喝水……",
      "cover": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A……",
      "category": "猫咪日常",
      "categorySlug": "cat",
      "authorName": "小满",
      "authorAvatar": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A……",
      "likes": 512,
      "commentsCount": 3,
      "tags": ["领养", "新手养猫", "橘猫"],
      "createdAt": "2026-11-06T02:18:00.000Z"
    }
  ],
  "total": 24,
  "page": 1,
  "pageSize": 2
}
```

> 说明：示例中的 `cover`、`authorAvatar` 实际是数百字符的内联 SVG，文档里做了截断；`content` 同理。真实响应字段完整。

**curl**

```bash
# 全部帖子，第 1 页
curl 'http://localhost:3001/api/posts?page=1&pageSize=10'
# 按分类筛选（slug / 中文名 / id 均可）
curl 'http://localhost:3001/api/posts?category=cat'
curl 'http://localhost:3001/api/posts?category=%E7%8C%AB%E5%92%AA%E6%97%A5%E5%B8%B8'
# 关键词搜索
curl 'http://localhost:3001/api/posts?keyword=%E7%8C%AB%E7%A0%82'
```

---

### 4.4 帖子详情（含评论）

```
GET /api/posts/:id
```

`comments` 按时间正序返回。

**响应示例（真实输出，图/正文已截断）**

```json
{
  "id": 1,
  "title": "三花猫每天早上六点整叫我起床，比闹钟还准",
  "content": "养了两年多的三花，最近一个月突然开始准点叫我……",
  "cover": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A……",
  "category": "猫咪日常",
  "categorySlug": "cat",
  "authorName": "阿菁",
  "authorAvatar": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A……",
  "likes": 236,
  "commentsCount": 2,
  "tags": ["猫咪日常", "晨间闹钟", "三花"],
  "createdAt": "2026-11-06T23:41:00.000Z",
  "comments": [
    {
      "id": 1,
      "postId": 1,
      "authorName": "小满",
      "content": "太真实了，我家也是六点零五，比上班还准时。",
      "createdAt": "2026-11-07T01:20:00.000Z"
    },
    {
      "id": 2,
      "postId": 1,
      "authorName": "毛球爸",
      "content": "睡前那顿湿粮真的有用，我加了个睡前逗猫十分钟，效果更明显。",
      "createdAt": "2026-11-07T03:05:00.000Z"
    }
  ]
}
```

**不存在的帖子（真实输出，HTTP 404）**

```json
{ "error": "帖子不存在或已被删除" }
```

**curl**

```bash
curl http://localhost:3001/api/posts/1
curl -i http://localhost:3001/api/posts/9999   # 404
```

---

### 4.5 发布帖子

```
POST /api/posts
Content-Type: application/json
```

**请求体**

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `title` | 是 | 标题，2~60 字符 |
| `content` | 是 | 正文，10~5000 字符 |
| `category` | 是 | 分类，支持 slug / 中文名 / id |
| `authorName` | 是 | 昵称，1~20 字符 |
| `tags` | 否 | 字符串数组，最多 5 个，每个最多 12 字符 |
| `cover` | 否 | 自定义封面 URL；不传则自动生成分类风格封面 |
| `authorAvatar` | 否 | 自定义头像 URL；不传则按昵称首字生成 |

**请求示例**

```bash
curl -X POST http://localhost:3001/api/posts \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "我家英短第一次学会用猫抓板",
    "content": "写了一个月的观察，沙发终于保住了，分享三个摆放位置的心得。",
    "category": "cat",
    "authorName": "验收小助手"
  }'
```

**成功响应（HTTP 201，真实输出，图/正文已截断）**

```json
{
  "id": 25,
  "title": "我家英短第一次学会用猫抓板",
  "content": "写了一个月的观察，沙发终于保住了，分享三个摆放位置的心得。",
  "cover": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A……",
  "category": "猫咪日常",
  "categorySlug": "cat",
  "authorName": "验收小助手",
  "authorAvatar": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A……",
  "likes": 0,
  "commentsCount": 0,
  "tags": [],
  "createdAt": "2026-11-07T07:28:12.345Z"
}
```

发布成功后，用返回的 `id` 跳转 `/posts/:id` 即可；新帖会排在列表第一位。

**参数错误响应（HTTP 400）**

```json
{ "error": "标题不能为空" }
{ "error": "标题至少需要 2 个字符" }
{ "error": "正文至少需要 10 个字符" }
{ "error": "昵称不能为空" }
{ "error": "请选择帖子分类" }
{ "error": "请求体不是合法的 JSON 格式" }
```

---

### 4.6 点赞

```
POST /api/posts/:id/like
```

无请求体。每次调用点赞数 +1，返回最新点赞数（前端直接用返回值更新数字即可）。

**响应示例（真实输出，两次调用）**

```json
{ "id": 1, "likes": 237 }
```

```json
{ "id": 1, "likes": 238 }
```

**错误响应（HTTP 404）**

```json
{ "error": "帖子不存在或已被删除" }
```

**curl**

```bash
curl -X POST http://localhost:3001/api/posts/1/like
```

---

### 4.7 百科列表

```
GET /api/articles?page=1&pageSize=50&category=health
```

| 参数 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- |
| `page` | 否 | `1` | 页码 |
| `pageSize` | 否 | `50` | 每页数量，最大 50（百科共 12 篇，不传分页参数一次返回全部） |
| `category` | 否 | 全部 | 分类筛选，支持 slug / 中文名 / id |

**响应示例（真实输出，`pageSize=2`，已截断长字段）**

```json
{
  "list": [
    {
      "id": 1,
      "title": "新手养猫完全指南：接猫回家前的 7 项准备",
      "summary": "从封窗、安全区到预算和附近医院，接猫前把这几件事做好，前两周会顺利很多。",
      "content": "第一次把猫接回家，很多人脑子里想的是猫窝、猫抓板、玩具……",
      "cover": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A……",
      "category": "猫咪日常",
      "categorySlug": "cat",
      "readCount": 5237,
      "createdAt": "2026-11-02T07:00:00.000Z"
    },
    {
      "id": 2,
      "title": "猫咪疫苗接种时间表与注意事项",
      "summary": "猫三联打几针、什么时候打狂犬、接种前后要注意什么，一篇讲清楚。",
      "content": "幼猫免疫不是一针就完事。常规安排是 8 周龄左右开始猫三联……",
      "cover": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A……",
      "category": "健康问诊",
      "categorySlug": "health",
      "readCount": 4812,
      "createdAt": "2026-10-27T07:00:00.000Z"
    }
  ],
  "total": 12,
  "page": 1,
  "pageSize": 2
}
```

**curl**

```bash
curl 'http://localhost:3001/api/articles'                       # 全部 12 篇
curl 'http://localhost:3001/api/articles?category=health'        # 按分类
```

---

### 4.8 百科详情

```
GET /api/articles/:id
```

打开详情时后端会把 `readCount` +1，并在响应里返回自增后的值（前端无需额外处理）。

**响应示例（真实输出，已截断正文）**

```json
{
  "id": 1,
  "title": "新手养猫完全指南：接猫回家前的 7 项准备",
  "summary": "从封窗、安全区到预算和附近医院，接猫前把这几件事做好，前两周会顺利很多。",
  "content": "第一次把猫接回家，很多人脑子里想的是猫窝、猫抓板、玩具……\n\n一、提前封窗……",
  "cover": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A……",
  "category": "猫咪日常",
  "categorySlug": "cat",
  "readCount": 5238,
  "createdAt": "2026-11-02T07:00:00.000Z"
}
```

**不存在的文章（HTTP 404）**

```json
{ "error": "百科文章不存在或已下架" }
```

`content` 中段落以 `\n\n` 分隔，前端可用 `content.split('\n\n')` 生成 `<p>`。

---

## 5. 错误码与提示一览

| 状态码 | 触发场景 | 返回示例 |
| --- | --- | --- |
| 400 | `page` / `pageSize` 非正整数 | `{"error":"页码 page必须是大于 0 的整数"}` |
| 400 | 分类不存在（列表筛选、发帖） | `{"error":"分类不存在，可选分类有：猫咪日常（cat）、狗狗生活（dog）…"}` |
| 400 | 发帖字段校验失败 | `{"error":"正文至少需要 10 个字符"}` |
| 400 | 请求体不是合法 JSON | `{"error":"请求体不是合法的 JSON 格式"}` |
| 404 | 帖子不存在 | `{"error":"帖子不存在或已被删除"}` |
| 404 | 百科文章不存在 | `{"error":"百科文章不存在或已下架"}` |
| 404 | 路径不存在 | `{"error":"接口不存在，请检查请求路径"}` |
| 413 | 请求体超过 256KB | `{"error":"请求内容过大，请精简后重试"}` |
| 500 | 服务内部异常 | `{"error":"服务器开小差了，请稍后再试"}` |

前端展示策略建议：优先展示 `error` 字段原文；网络不通时展示「网络开小差了，请确认后端服务已启动（3001 端口）」。

---

## 6. 种子数据说明

数据库文件：`apps/api/data/pet.db`（首次启动自动创建并写入，重复启动不会重复插入）。

| 内容 | 数量 | 说明 |
| --- | --- | --- |
| 分类 | 6 | 猫咪日常 / 狗狗生活 / 异宠天地 / 健康问诊 / 科学喂养 / 行为训练 |
| 帖子 | 24 | 每篇 100~300 字自然中文正文，含作者昵称、标签、点赞数、发布时间 |
| 评论 | 51 | 分布在多篇帖子下，作者昵称与内容均为真实感中文 |
| 百科 | 12 | 每篇 4~8 段正文，含摘要、阅读数 |

- 帖子发布时间分布在 2026-09-28 至 2026-11-06 之间。
- 点赞数 73~858，百科阅读数 1587~5236。
- 所有图片（封面、头像）为内联 SVG，**不需要联网**即可显示。
- 想恢复初始数据：停掉服务后删除 `apps/api/data/pet.db*`，再启动即可重新生成。

---

## 7. 启动与自检

```bash
# 只启动后端（在项目根目录）
npm run dev:api

# 或在 apps/api 目录
npm run start        # node src/server.js
npm run dev          # node --watch src/server.js，改代码自动重启
```

启动成功终端会打印：

```
  🐾 宠物社区 API 已启动
  接口地址：http://localhost:3001/api
  健康检查：http://localhost:3001/api/health
  数据文件：…/apps/api/data/pet.db
  当前数据：分类 6 个 / 帖子 24 篇 / 评论 51 条 / 百科 12 篇
```

浏览器直接打开 `http://localhost:3001/api` 可以看到接口总览；打开 `/api/health` 可以确认服务是否正常。

> 启动时出现 `ExperimentalWarning: SQLite is an experimental feature` 属于正常现象，是 Node 内置 SQLite 的实验特性提示，不影响使用。
