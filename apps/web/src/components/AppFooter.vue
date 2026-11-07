<template>
  <footer class="app-footer">
    <div class="container footer-main">
      <div class="footer-brand">
        <div class="footer-logo">
          <span aria-hidden="true">🐾</span>
          <strong>宠物社区</strong>
        </div>
        <p class="footer-slogan">这里有毛孩子的日常，也有把它们照顾好的答案。</p>
        <p class="footer-note">首版演示 · 内容均为示例数据</p>
      </div>

      <div class="footer-nav">
        <div class="footer-col">
          <h4>逛社区</h4>
          <RouterLink to="/">首页</RouterLink>
          <RouterLink to="/posts">全部动态</RouterLink>
          <RouterLink to="/publish">发布动态</RouterLink>
        </div>
        <div class="footer-col">
          <h4>养宠百科</h4>
          <RouterLink to="/wiki">全部文章</RouterLink>
          <RouterLink to="/posts?category=health">健康养护</RouterLink>
          <RouterLink to="/posts?category=feeding">科学喂养</RouterLink>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="container">© 2026 宠物社区 · 陪每个毛孩子好好长大</div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  margin-top: 56px;
  background: linear-gradient(180deg, rgba(255, 247, 239, 0.4), #fff4e8);
  border-top: 1px solid var(--line);
}

.footer-main {
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding-top: 38px;
  padding-bottom: 28px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--brown);
  font-size: 17px;
}

.footer-logo span {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 12px;
  background: #fff;
  box-shadow: var(--shadow-sm);
}

.footer-slogan {
  margin-top: 12px;
  max-width: 360px;
  color: var(--text-2);
  font-size: 13px;
}

.footer-note {
  margin-top: 8px;
  color: var(--muted);
  font-size: 12px;
}

.footer-nav {
  display: flex;
  gap: 56px;
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.footer-col h4 {
  margin-bottom: 2px;
  font-size: 13px;
  color: var(--brown);
}

.footer-col a {
  font-size: 13px;
  color: var(--muted);
  transition: color 0.16s ease;
}

.footer-col a:hover {
  color: var(--primary-strong);
}

.footer-bottom {
  border-top: 1px solid rgba(232, 213, 195, 0.7);
  padding: 14px 0 calc(14px + env(safe-area-inset-bottom, 0px));
  color: var(--muted);
  font-size: 12px;
  text-align: center;
}

@media (min-width: 640px) {
  .footer-main {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    gap: 40px;
  }

  .footer-nav {
    gap: 64px;
  }
}

@media (max-width: 767px) {
  .app-footer {
    margin-top: 36px;
  }

  .footer-bottom {
    padding-bottom: 18px;
  }
}
</style>
