import { API_BASE, REQUEST_TIMEOUT } from './config'

export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function statusMessage(status) {
  if (status === 404) return '内容不存在或已被删除'
  if (status === 400) return '提交的内容不太对，请检查后重试'
  if (status === 413) return '内容太长了，精简一下再试试'
  if (status >= 500) return '接口服务暂时没有响应，请确认后端已启动（3001 端口）后重试'
  return `请求失败（${status}）`
}

/**
 * 统一的请求封装：超时、错误文案、JSON 解析都收口在这里
 * @param {string} path 以 / 开头的接口路径，例如 /posts
 * @param {{method?: string, body?: object, timeout?: number}} options
 */
export async function request(path, options = {}) {
  const { method = 'GET', body, timeout = REQUEST_TIMEOUT } = options
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(`${API_BASE}${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal
    })

    let data = null
    const text = await response.text()
    if (text) {
      try {
        data = JSON.parse(text)
      } catch {
        data = null
      }
    }

    if (!response.ok) {
      const message =
        data && typeof data.error === 'string' && data.error
          ? data.error
          : statusMessage(response.status)
      throw new ApiError(message, response.status)
    }

    return data
  } catch (error) {
    if (error instanceof ApiError) throw error
    if (error && error.name === 'AbortError') {
      throw new ApiError('请求超时了，请稍后再试', 0)
    }
    throw new ApiError('网络开小差了，请确认后端服务已启动（3001 端口）后重试', 0)
  } finally {
    clearTimeout(timer)
  }
}
