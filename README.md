# 🐾 宠物社区（首版 MVP）

一个中文宠物垂直网站：**晒宠物、看别人的养宠经验、查养宠知识**。

> 这份说明写给不懂技术的同学。你不需要看懂代码，只要照着「怎么启动」做三步，就能在自己电脑上把网站点开。
> 全程大约 1 分钟，不用装数据库、不用配服务器。

---

## 一、这个网站现在能干什么

首版就 5 个页面，覆盖"看内容"和"发内容"两件事：

| 页面 | 地址 | 能干什么 |
| --- | --- | --- |
| 首页 | `/` | 品牌头、分类入口、热门帖子、百科推荐 |
| 帖子列表 | `/posts` | 按「猫 / 狗 / 异宠 / 健康 / 喂养 / 行为」筛选，分页浏览 |
| 帖子详情 | `/posts/:id` | 看正文和评论，点个赞数字会 +1 |
| 发布帖子 | `/publish` | 填标题、分类、正文、昵称，发完自动跳到新帖 |
| 养宠百科 | `/wiki`、`/wiki/:id` | 文章列表 + 文章详情 |

打开网站就已经有 **24 条帖子、51 条评论、12 篇百科、6 个分类**的示例内容，不用自己先录数据。

## 二、团队分工

| 角色 | 负责 |
| --- | --- |
| Lead | 产品方案、任务拆分、最终验收 |
| architect（技术负责人） | 工程骨架、技术选型、一键启动、联调收口 |
| frontend-dev | 5 个页面的样子和交互 |
| backend-dev | 接口、数据库、示例数据、接口文档 |

## 三、怎么启动（3 步）

### 第 1 步：确认电脑有 Node.js

打开「终端」（Windows 用 PowerShell），粘贴回车：

```bash
node -v
```

- 显示 `v22` 及以上（比如 `v25.2.1`）→ 没问题，进第 2 步
- 提示"命令不存在" → 去 <https://nodejs.org> 下载 LTS 版本，一路下一步装完，**关掉终端重新打开**

### 第 2 步：第一次使用时，装一次依赖

在项目文件夹里执行（复制整行，注意是**项目根目录**）：

```bash
cd /Users/twx/Documents/deepseek-harness/default-workspace
npm install
```

> 只有第一次（或别人改了依赖）需要跑。看到 `found 0 vulnerabilities` 就是成功了，不用管中间的花括号和进度条。本项目实测：`added 133 packages, audited 136 packages, 0 vulnerabilities`，约 2 秒。

> ⚠️ **只在上面这个根目录执行 `npm install`**。不要 `cd apps/web` 或 `cd apps/api` 里再单独装一次——这个项目是"一个根目录管前后端"的结构，在子目录里安装会卡住、甚至把已装好的依赖写坏（我们踩过这个坑）。

### 第 3 步：每次看网站，一条命令

```bash
cd /Users/twx/Documents/deepseek-harness/default-workspace
npm run dev
```

等 5 秒左右，终端里会看到绿色/紫色的两行 `api` 和 `web` 日志，然后用浏览器打开：

👉 **<http://localhost:5173>**

这就是网站首页。

> ⚠️ 运行 `npm run dev` 的那个终端窗口**不要关**，关掉网站就停了。可以最小化。

## 四、怎么停止

在那个终端窗口里按 `Ctrl + C`（按一次即可）。或者直接把窗口关掉。

不建议直接拔电源/强制退出，容易出现"端口被占用"（见下一节）。

## 四之二、怎么把数据恢复成初始样子

自己发了几条测试帖、想清干净重新给别人演示时：

1. 先在运行窗口按 `Ctrl + C` **停掉网站**（这步不能省，否则文件删不掉）
2. 删除一个本地数据文件：

   ```bash
   cd /Users/twx/Documents/deepseek-harness/default-workspace
   rm -f apps/api/data/pet.db apps/api/data/pet.db-wal apps/api/data/pet.db-shm
   ```

3. 再执行 `npm run dev`。后端发现没有数据库会自动重建，回到**24 条帖子、51 条评论、12 篇百科、6 个分类**的初始内容。

> 这个文件只存在你本机，不会上传、不会影响别人。

## 五、出问题怎么办

**先跑一次自检**，它会把问题指出来：

```bash
cd /Users/twx/Documents/deepseek-harness/default-workspace
npm run doctor
```

然后对照下表：

| 现象 | 原因 | 怎么解决 |
| --- | --- | --- |
| 报 `EADDRINUSE` / "端口被占用" | 上次没关干净，3001 或 5173 还被占着 | 跑 `npm run doctor`，它会告诉你占用进程号，执行 `kill 那个数字` 再启动 |
| 报 `Cannot find module` / `Missing script` | 依赖没装好或装残了 | 在项目根目录先 `rm -rf node_modules`，再 `npm install` |
| 在 `apps/web` 或 `apps/api` 里面执行了 `npm install`，卡住不动 | 项目是根目录统一管理依赖，子目录里安装会卡住/写坏依赖 | 让那个窗口 `Ctrl + C`，回到根目录执行 `rm -rf node_modules && npm install` |
| 浏览器打不开 `localhost:5173` | 还没启动完，或窗口被关了 | 等 5–10 秒刷新；确认终端里 `web` 那行还在跑 |
| 页面能打开但列表是空的、或者弹出红色提示 | 后端没起来 | 看终端里 `api` 那行有没有红色报错；跑 `npm run doctor` 看 3001 端口 |
| 终端出现 `ExperimentalWarning: SQLite is an experimental feature` | Node 自带的数据库还是实验特性 | **正常提示，不影响使用，忽略即可** |
| 页面样式乱了 / 改了没生效 | 浏览器缓存 | `Cmd + Shift + R`（Windows 是 `Ctrl + Shift + R`）强制刷新 |
| 实在搞不定 | — | 把 `npm run doctor` 的输出截图发我，我来看 |

## 六、看数据、看接口

- 后端是否活着：浏览器打开 <http://localhost:3001/api/health>，能看到 `{"ok":true}` 就正常
- 接口清单与字段说明：见 [docs/api-contract.md](docs/api-contract.md)
- 技术选型、目录结构、前后端怎么配合：见 [docs/architecture.md](docs/architecture.md)
- 产品范围与不做什么：见 [docs/product-mvp.md](docs/product-mvp.md)

## 七、项目文件夹里都是什么

```
pet-community/
├── apps/web/     前端：你在浏览器里看到的样子（页面、样式、交互）
├── apps/api/     后端：数据从哪来、接口怎么返回
├── docs/         文档：产品方案、架构说明、接口契约
├── scripts/      小工具：doctor（环境自检）
└── package.json  项目总入口：npm install / npm run dev 都在这里定义
```

一句话理解：**web 负责"好看好用"，api 负责"数据准确"**。浏览器里的 `/api/...` 请求会自动转给后端，你不需要手动配。

## 八、验收清单（对照着点一遍）

```
打开首页 → 点分类 → 进帖子详情 → 点个赞（数字 +1）→ 回列表
→ 发布一条新帖 → 自动跳到详情 → 回列表能看到刚发的帖
→ 进百科列表 → 打开一篇文章
```

全部走通、页面没有报错弹窗，首版就算验收通过。

## 九、首版明确不做的

登录注册、真实图片上传、发表评论、支付/商城、消息通知、上线部署。这些都在下一版路线里，别在首版验收时提。

## 十、技术栈（仅供技术同学参考，非技术可以跳过）

前端 Vue 3 + Vite，后端 Node 25 + Express，数据库用 Node 自带的 SQLite（免安装、数据存本地一个文件），包管理统一用 npm，根目录 `npm run dev` 用 concurrently 同时拉起前后端。

> 已知提示：启动后端时终端会打印 `ExperimentalWarning: SQLite is an experimental feature`，这是 Node 对内置 SQLite 的常规提醒，不影响功能。
