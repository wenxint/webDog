# 技术架构说明（宠物社区 · 首版 MVP）

> 读者：需要动手改代码/排查问题的人。产品视角请看 [README](../README.md)，产品范围请看 [product-mvp.md](./product-mvp.md)，接口字段请看 [api-contract.md](./api-contract.md)。
> 维护：architect

## 1. 架构总览

首版是最简单的"前后端分离"结构，只有两个进程，没有数据库服务、没有容器、没有构建流水线：

```
浏览器 http://localhost:5173
        │
        ├─ 静态资源（页面/样式/JS）──► Vite 开发服务器 :5173（apps/web）
        │
        └─ /api/** 请求 ──代理──► Express 接口服务 :3001（apps/api）
                                        │
                                        └──► node:sqlite 本地文件 apps/api/data/pet.db
```

**为什么要这么分**：前端管"看得见的东西"，后端管"数据。两边通过 HTTP 接口约定协作，谁改坏了都能单独排查；日后要拆出去部署也不用重写。

## 2. 技术选型与理由

| 层 | 选型 | 为什么选它 | 放弃了什么 |
| --- | --- | --- | --- |
| 前端 | Vue 3 + Vite | 上手快、模板语法直观、Vite 自带热更新，改完立刻看到 | 没用 React（团队更熟 Vue）；没用 Next/Nuxt（首版不需要 SSR） |
| 路由 | vue-router | 5 个页面需要真实 URL，方便直接分享/刷新 | — |
| 请求 | axios 或 fetch | 统一封装 `src/api/`，便于切换真实/mock | — |
| 后端 | Node.js 25 + Express | 只用 JS，一个进程启动；Express 生态最省心，中间件写法简单 | 没用 Nest/Koa（首版不值得引入 DI 和分层框架） |
| 数据库 | **node:sqlite**（Node 内置） | 零安装、零配置，数据落单个文件，删了自动重建 | 没用 MySQL/Postgres/Mongo（要装服务、要起端口）；没用 better-sqlite3（需编译原生模块，换机器易炸） |
| 语言 | JavaScript（不引入 TypeScript） | 省掉编译链和类型配置，改一行就跑 | 放弃类型检查；接口契约靠文档 + 约定字段兜底 |
| 包管理 | **npm workspaces** | 本机没有 pnpm/corepack，npm 原生支持 monorepo；一次 `npm install` 装齐前后端 | 放弃 pnpm 的硬链接省盘（首版不敏感） |
| 一键启动 | concurrently | 一条命令并行拉起两个进程，任一方挂掉一起退出，避免"看起来在跑其实缺一半" | 放弃 docker-compose（客户要一条命令跑起来，不引入 Docker） |
| 环境自检 | `scripts/doctor.mjs`（零依赖） | 非技术同学出问题能自助定位：Node 版本、依赖、端口、SQLite 能力 | — |

**硬约束（客户环境事实）**：Node v25.2.1 / npm 11.6.2，**无 pnpm、无 corepack**，全部命令统一用 npm。

## 3. 目录结构

```
pet-community/
├── package.json            # 根：私有包、workspaces、dev/dev:web/dev:api/doctor 脚本
├── package-lock.json       # npm 锁文件（提交）
├── .gitignore              # 忽略 node_modules / dist / *.db / 日志 / .DS_Store
├── README.md               # 面向产品经理的启动与排障说明
├── scripts/
│   └── doctor.mjs          # npm run doctor：环境自检（零依赖）
├── docs/
│   ├── product-mvp.md      # 产品范围（Lead 维护）
│   ├── architecture.md     # 本文（architect 维护）
│   └── api-contract.md     # 前后端接口契约（backend-dev 维护，唯一契约源）
└── apps/
    ├── web/                # 前端（frontend-dev 维护）
    │   ├── package.json    # dev: vite --port 5173；vite.config.js 代理 /api → 3001
    │   ├── index.html
    │   └── src/            # main.js / App.vue / router / views / components / api
    └── api/                # 后端（backend-dev 维护）
        ├── package.json    # dev: node --watch src/server.js
        ├── src/            # server.js / routes / db / seed
        └── data/pet.db     # 首次启动自动生成（已在 .gitignore 中，不入库）
```

**边界规则**：`apps/web/` 只由前端改，`apps/api/` 只由后端改；根配置与文档由技术负责人收口。跨边界的改动先改契约文档，再同步代码。

## 4. 端口与地址约定

| 用途 | 地址 | 说明 |
| --- | --- | --- |
| 前端网站 | <http://localhost:5173> | 团队/客户统一访问入口，**只记这一个** |
| 后端接口 | <http://localhost:3001/api/**> | 前端通过 Vite 代理访问，不需要直连 |
| 后端健康检查 | <http://localhost:3001/api/health> | 返回 `{"ok":true}` 表示后端存活 |

- 5173 固定（`vite --port 5173`，不自动换端口，避免代理和文档对不上）。
- 3001 固定（后端 `app.listen(3001)`）。
- 开发期 CORS 允许 `http://localhost:5173`；由于有代理，正常页面请求不会触发跨域。

**Vite 代理（前端必须这样配）**：

```js
// apps/web/vite.config.js
server: {
  port: 5173,
  proxy: { '/api': { target: 'http://localhost:3001', changeOrigin: true } }
}
```

这样前端代码里只写相对路径 `/api/posts`，切到生产环境时把代理换成真实域名即可，业务代码不用改。

## 5. 前后端协作方式

1. **契约先行**：`docs/api-contract.md` 是唯一契约源，字段名/路径/状态码/错误格式以它为准。后端实现与文档不一致时，以文档为准或同步改文档并通知前端。
2. **错误格式统一**：失败返回 `{ "error": "中文提示" }` + 合理 HTTP 状态码（400 参数错、404 不存在、500 服务异常）。前端据此直接展示中文提示，不做字段猜测。
3. **Mock 兜底**：后端未就绪时前端用 `src/mock/` 假数据，开关在 `apps/web/src/api/config.js` 的 `USE_MOCK`。**联调验收前必须切成真实接口**，即 `USE_MOCK = false`（或按环境变量判断）。
4. **联调信号**：后端完成后在任务板/群里给出"接口可用"；前端把 mock 关掉，走一遍主流程；技术负责人负责最终一条命令验收（task-4）。
5. **改动波及**：改接口字段 → 先改契约 → 通知前端 → 两边同时改 → 一起回归主流程。

## 6. 数据与状态

- 数据库文件 `apps/api/data/pet.db`，首次启动自动建表 + 写种子数据（**6 分类 / 24 帖 / 51 评论 / 12 百科**）；重复启动不重复写，幂等。
- 想重置数据：停掉服务，删除 `apps/api/data/pet.db*`（含 `-wal` / `-shm`），再启动即可重建。
- 该文件已被 `.gitignore` 忽略，属于本机运行产物，不提交。
- 发布的新帖、点赞数变化都写进这个文件，重启后仍在（首版不做登录，作者用昵称）。

## 7. npm 命令约定（全部在根目录执行）

| 命令 | 作用 |
| --- | --- |
| `npm install` | 一次装齐根 + 前后端所有依赖（workspaces 提升到根 `node_modules`） |
| `npm run dev` | 并行启动 api(3001) + web(5173)，`-k` 保证一方崩溃另一方也退出 |
| `npm run dev:api` | 只起后端 |
| `npm run dev:web` | 只起前端（后端没起时页面会报接口错误，属预期） |
| `npm run doctor` | 环境自检：Node 版本 / 依赖 / 端口占用 / SQLite 能力 |

**铁律：只在仓库根目录执行 `npm install`。** 不要 `cd apps/web` / `cd apps/api` 里单独安装——workspaces 会把依赖提升到根 `node_modules`，在子目录安装（尤其两人同时装）会互相覆盖，实测出现过 `qs` 被写残、express 启动报 `Cannot find module 'qs'` 的情况。子目录里出现 `node_modules/` 说明装错了，删掉并在根目录重装。

**不要**新增 pnpm/yarn 脚本或锁文件；不要引入 Docker、数据库服务、TypeScript 编译链。

## 8. 常见故障与定位顺序

1. `npm run doctor` —— 先看它报什么，覆盖面：Node 版本、依赖缺失、端口占用（附进程号）、内置 SQLite 可用性。
2. 端口被占：`lsof -iTCP:3001 -sTCP:LISTEN` / `lsof -iTCP:5173 -sTCP:LISTEN`，`kill <pid>` 后重开。
3. 页面在、数据空：先直接 curl 后端 `curl http://localhost:3001/api/health`，再逐条 curl 业务接口，确认问题在后端还是代理。
4. 代理不生效：确认 `vite.config.js` 的 `server.proxy` 存在且 target 是 3001；改完配置需重启 `npm run dev`（Vite 配置不热更新）。
5. `ExperimentalWarning: SQLite is an experimental feature` —— Node 内置 SQLite 的正常提示，**不是错误**，不需要处理。
6. `node --watch` 下改代码会自动重启；如果改完没反应，看终端是否有语法错误导致进程退出。
7. 依赖"半装"症状（`Cannot find module 'xxx'` 指向 `node_modules/express/lib/...` 之类）：根目录 `rm -rf node_modules && npm install`，**不要**只补装单个包。
8. 端口写了但访问不通：本项目 5173 是 `--strictPort`（固定端口，不会自动换），如果 5173 被占，`npm run dev` 会直接报错退出而不是换端口——直接按第 2 条处理。

## 9. 安全与范围（首版刻意不做）

- 无登录鉴权，发布接口只做基本参数校验（长度、必填、非空），**不面向公网**，仅本机演示。
- 不接收文件上传，封面图用外链/占位图。
- 不做 SQL 拼接：统一用参数化查询（`db.prepare(...).run(...)`），避免注入。

## 10. 演进路线（不在首版）

| 需求 | 预期改动 |
| --- | --- |
| 部署上线 | 前端 `vite build` 出静态包；后端加进程管理 + 反向代理；数据库文件挂持久盘 |
| 并发变高 / 多实例 | SQLite 换 Postgres，加一层 `db/` 适配，路由层基本不动 |
| 登录与权限 | 后端加 `users` 表 + JWT/session 中间件；前端加路由守卫 |
| 图片上传 | 后端加 `multer` + 静态目录，前端换成上传组件 |
| 类型安全 | 逐步引入 TS：先 api 层 `JSDoc` 类型标注，不当成首版任务 |

## 11. 首版联调验收记录（2026-11-07，architect）

环境：macOS，Node v25.2.1，npm 11.6.2，无 pnpm/corepack。

| 验收项 | 命令 / 方式 | 结果 |
| --- | --- | --- |
| 干净安装 | `rm -rf node_modules && npm install` | `added 133 packages, audited 136 packages, 0 vulnerabilities`，2s，exit 0 |
| 一键启动 | `npm run dev` | api(3001) + web(5173) 同时起来，3 秒内两端可达 |
| 健康检查（经代理） | `curl :5173/api/health` | `{"ok":true,"counts":{"categories":6,"posts":24,"comments":51,"articles":12}}` |
| 分类筛选 | `GET /api/posts?category=cat` | total=5，返回分类唯一值为"猫咪日常" |
| 帖子详情 | `GET /api/posts/1` | 标题/作者/点赞 236/评论 2 条，字段与契约一致 |
| 点赞 | `POST /api/posts/1/like` | likes 236 → 237，页面显示 237 |
| 发布新帖 | `POST /api/posts`（经 5173 代理） | 返回 id=25，列表 total 24→25 |
| 前端走真实接口 | 无头 Chrome 渲染 `/posts` 后抓 DOM | DOM 中出现刚发布的新帖标题 → **非 mock**，走真实 3001 |
| 百科 | `GET /api/articles`、`/api/articles/1` | 12 篇，详情正文 401 字 |
| 错误契约 | `GET /api/posts/99999`、空标题 POST | 404 `{"error":"帖子不存在或已被删除"}`、400 `{"error":"标题不能为空"}` |
| 数据重置 | 删 `apps/api/data/pet.db*` 后重启 | 回到 6 分类 / 24 帖 / 51 评论 / 12 百科，id 1–24，无联调残留 |

页面视觉抽样见 `/tmp/pet-t4-shots/`（430×932 移动端视口，首页/列表/详情/发布/百科）。
