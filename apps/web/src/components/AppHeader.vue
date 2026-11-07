<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

function isActive(path) {
  if (path === '/') return route.path === '/'
  return route.path === path || route.path.startsWith(`${path}/`)
}
</script>

<template>
  <header class="app-header">
    <div class="container header-inner">
      <RouterLink to="/" class="brand" aria-label="宠物社区首页">
        <span class="brand-mark" aria-hidden="true">🐾</span>
        <span class="brand-text">
          <strong>宠物社区</strong>
          <small>陪毛孩子好好长大</small>
        </span>
      </RouterLink>

      <nav class="desktop-nav" aria-label="主导航">
        <RouterLink to="/" class="nav-link" :class="{ active: isActive('/') }">首页</RouterLink>
        <RouterLink to="/posts" class="nav-link" :class="{ active: isActive('/posts') }">
          社区
        </RouterLink>
        <RouterLink to="/wiki" class="nav-link" :class="{ active: isActive('/wiki') }">
          养宠百科
        </RouterLink>
      </nav>

      <RouterLink to="/publish" class="btn btn-primary btn-sm header-cta">
        ✍️ 发布动态
      </RouterLink>
      <RouterLink to="/publish" class="btn btn-primary btn-sm header-cta-mobile">
        ✍️ 发布
      </RouterLink>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(255, 249, 242, 0.86);
  backdrop-filter: saturate(150%) blur(12px);
  -webkit-backdrop-filter: saturate(150%) blur(12px);
  border-bottom: 1px solid rgba(242, 228, 215, 0.8);
}

.header-inner {
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 64px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 14px;
  font-size: 21px;
  background: linear-gradient(140deg, #fff, #ffe7d4);
  box-shadow: 0 6px 16px rgba(255, 138, 76, 0.22);
  border: 1px solid rgba(255, 219, 194, 0.9);
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.brand-text strong {
  font-size: 17px;
  color: var(--brown);
  letter-spacing: 0.02em;
}

.brand-text small {
  margin-top: 3px;
  font-size: 11px;
  color: var(--muted);
  letter-spacing: 0.04em;
}

.desktop-nav {
  display: none;
  margin-left: auto;
  align-items: center;
  gap: 6px;
}

.nav-link {
  position: relative;
  padding: 8px 16px;
  border-radius: var(--radius-full);
  font-size: 14px;
  font-weight: 600;
  color: var(--text-2);
  transition: color 0.18s ease, background 0.18s ease;
}

.nav-link:hover {
  color: var(--primary-strong);
  background: rgba(255, 233, 217, 0.55);
}

.nav-link.active {
  color: var(--primary-strong);
  background: var(--primary-soft);
}

.header-cta {
  display: none;
  margin-left: 18px;
}

.header-cta-mobile {
  display: inline-flex;
  margin-left: auto;
}

@media (min-width: 768px) {
  .desktop-nav {
    display: flex;
  }

  .header-cta {
    display: inline-flex;
  }

  .header-cta-mobile {
    display: none;
  }
}
</style>
