/** 把 ISO 时间格式化成社区里常见的相对时间 */
export function formatTime(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const diff = Date.now() - date.getTime()
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour

  if (diff < 0) return '刚刚'
  if (diff < minute) return '刚刚'
  if (diff < hour) return `${Math.floor(diff / minute)} 分钟前`
  if (diff < day) return `${Math.floor(diff / hour)} 小时前`
  if (diff < 2 * day) return '昨天'
  if (diff < 7 * day) return `${Math.floor(diff / day)} 天前`

  const now = new Date()
  const month = date.getMonth() + 1
  const dayOfMonth = date.getDate()
  if (date.getFullYear() === now.getFullYear()) {
    return `${month} 月 ${dayOfMonth} 日`
  }
  return `${date.getFullYear()} 年 ${month} 月 ${dayOfMonth} 日`
}

/** 数字展示：一万以上用「万」，避免长数字破坏排版 */
export function formatCount(value) {
  const count = Number(value) || 0
  if (count >= 10000) {
    const text = (count / 10000).toFixed(1).replace(/\.0$/, '')
    return `${text} 万`
  }
  return String(count)
}

/** 正文摘要：去掉换行，超长截断 */
export function excerpt(text, max = 70) {
  const plain = String(text || '')
    .replace(/\s+/g, ' ')
    .trim()
  if (!plain) return ''
  return plain.length > max ? `${plain.slice(0, max)}…` : plain
}

/** 把正文按空行/换行拆成段落，过滤空段落 */
export function splitParagraphs(text) {
  return String(text || '')
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean)
}

/** 判断一个头像字段是不是图片地址 */
export function isImageUrl(value) {
  return typeof value === 'string' && /^(https?:\/\/|\/|data:image\/)/.test(value)
}

/** 取昵称首字，作为头像兜底 */
export function nameInitial(name) {
  const text = String(name || '').trim()
  return text ? text.slice(0, 1) : '🐾'
}
