import { reactive, readonly } from 'vue'

const state = reactive({ items: [] })
let seed = 0

/**
 * 极简全局轻提示：成功操作给一点正反馈，失败也用它兜底提示。
 * 用法：const { success, error } = useToast(); success('发布成功')
 */
export function useToast() {
  function show(message, type = 'success', duration = 2400) {
    const id = ++seed
    state.items.push({ id, message, type })
    window.setTimeout(() => {
      const index = state.items.findIndex((item) => item.id === id)
      if (index > -1) state.items.splice(index, 1)
    }, duration)
    return id
  }

  return {
    items: readonly(state).items,
    show,
    success: (message) => show(message, 'success'),
    error: (message) => show(message, 'error', 3200)
  }
}
