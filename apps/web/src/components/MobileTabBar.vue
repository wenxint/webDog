<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const tabs = [
  { label: '首页', to: '/', icon: '🏠' },
  { label: '社区', to: '/posts', icon: '🐾' },
  { label: '百科', to: '/wiki', icon: '📖' },
  { label: '发布', to: '/publish', icon: '✍️' }
]

function isActive(path) {
  if (path === '/') return route.path === '/'
  return route.path === path || route.path.startsWith(`${path}/`)
}
</script>

<template>
  <nav class="tabbar only-mobile" aria-label="底部导航">
    <RouterLink
      v-for="tab in tabs"
      :key="tab.to"
      :to="tab.to"
      class="tab-item"
      :class="{ active: isActive(tab.to) }"
    >
      <span class="tab-icon" aria-hidden="true">{{ tab.icon }}</span>
      <span class="tab-label">{{ tab.label }}</span>
    </RouterLink>
  </nav>
</template>

<style scoped>
.tabbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 60;
  display: flex;
  align-items: stretch;
  padding: 5px 6px calc(5px + env(safe-area-inset-bottom, 0px));
  background: rgba(255, 253, 250, 0.95);
  backdrop-filter: saturate(160%) blur(14px);
  -webkit-backdrop-filter: saturate(160%) blur(14px);
  border-top: 1px solid rgba(242, 228, 215, 0.9);
  box-shadow: 0 -4px 18px rgba(122, 82, 52, 0.05);
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 5px 0 3px;
  border-radius: 12px;
  color: var(--muted);
  transition: color 0.18s ease, background 0.18s ease;
}

.tab-icon {
  font-size: 19px;
  line-height: 1.2;
  filter: grayscale(0.35);
  transition: transform 0.18s ease, filter 0.18s ease;
}

.tab-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.tab-item.active {
  color: var(--primary-strong);
  background: rgba(255, 233, 217, 0.6);
}

.tab-item.active .tab-icon {
  filter: none;
  transform: translateY(-1px) scale(1.08);
}
</style>
