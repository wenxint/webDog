// 接口开关与全局配置
// USE_MOCK = true 时全部页面使用本地 mock 数据，后端没启动也能完整体验；
// 联调阶段改为 false，即走 Vite 代理 /api → http://localhost:3001 的真实接口。
export const USE_MOCK = false

// 真实接口前缀（开发环境由 Vite 代理到 3001）
export const API_BASE = '/api'

// 单次请求超时时间（毫秒）
export const REQUEST_TIMEOUT = 10000

// 帖子列表每页条数
export const PAGE_SIZE = 6

// mock 模拟网络延迟（毫秒），让 loading 态可见
export const MOCK_DELAY = 320
