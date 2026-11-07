const TONE_EMOJI = {
  cat: '🐱',
  dog: '🐶',
  exotic: '🐰',
  health: '🩺',
  feeding: '🍚',
  behavior: '🎓',
  default: '🐾'
}

const CATEGORY_TONES = ['cat', 'dog', 'exotic', 'health', 'feeding', 'behavior']

// 分类接口不可用时，至少保证常见 slug 能显示成中文名
const SLUG_FALLBACK = {
  cat: { name: '猫咪日常', icon: '🐱' },
  dog: { name: '狗狗天地', icon: '🐶' },
  exotic: { name: '异宠星球', icon: '🐰' },
  health: { name: '健康养护', icon: '🩺' },
  feeding: { name: '科学喂养', icon: '🍚' },
  behavior: { name: '行为训练', icon: '🎓' }
}

/** 根据分类的 slug / 中文名判断视觉色调，兼容真实接口返回任意一种 */
export function categoryTone(value) {
  let raw = ''
  if (typeof value === 'string' || typeof value === 'number') {
    raw = String(value)
  } else if (value && typeof value === 'object') {
    raw = String(value.slug || value.name || value.id || '')
  }
  const text = raw.toLowerCase()

  if (text.includes('cat') || text.includes('猫')) return 'cat'
  if (text.includes('dog') || text.includes('狗') || text.includes('犬')) return 'dog'
  if (
    text.includes('exotic') ||
    text.includes('异宠') ||
    text.includes('兔') ||
    text.includes('鸟') ||
    text.includes('鹦鹉') ||
    text.includes('仓鼠') ||
    text.includes('爬宠')
  ) {
    return 'exotic'
  }
  if (text.includes('health') || text.includes('健康') || text.includes('医') || text.includes('护理')) {
    return 'health'
  }
  if (text.includes('feed') || text.includes('喂养') || text.includes('饮食') || text.includes('粮')) {
    return 'feeding'
  }
  if (text.includes('behavior') || text.includes('行为') || text.includes('训练') || text.includes('训练')) {
    return 'behavior'
  }
  return 'default'
}

export function categoryEmoji(value) {
  return TONE_EMOJI[categoryTone(value)] || TONE_EMOJI.default
}

/**
 * 把帖子里的 category 字段解析成 { name, slug, icon, postCount }
 * 真实后端可能返回 slug、中文名或 id，这里都兜住
 */
export function resolveCategory(value, categories = []) {
  const list = Array.isArray(categories) ? categories : []

  if (!value) {
    return { id: 0, name: '综合', slug: '', icon: '🐾', postCount: 0 }
  }

  if (typeof value === 'object') {
    const matched = list.find(
      (item) =>
        (value.slug && item.slug === value.slug) ||
        (value.name && item.name === value.name) ||
        (value.id && String(item.id) === String(value.id))
    )
    const merged = matched || value
    return {
      id: merged.id ?? 0,
      name: merged.name || '综合',
      slug: merged.slug || '',
      icon: merged.icon || categoryEmoji(merged.slug || merged.name),
      postCount: merged.postCount ?? 0
    }
  }

  const matched = list.find(
    (item) =>
      item.slug === value ||
      item.name === value ||
      String(item.id) === String(value)
  )

  if (matched) {
    return {
      id: matched.id ?? 0,
      name: matched.name || '综合',
      slug: matched.slug || '',
      icon: matched.icon || categoryEmoji(matched.slug || matched.name),
      postCount: matched.postCount ?? 0
    }
  }

  const fallback = SLUG_FALLBACK[String(value)]
  return {
    id: 0,
    name: fallback ? fallback.name : String(value),
    slug: typeof value === 'string' ? value : '',
    icon: fallback ? fallback.icon : categoryEmoji(value),
    postCount: 0
  }
}

export { CATEGORY_TONES }
