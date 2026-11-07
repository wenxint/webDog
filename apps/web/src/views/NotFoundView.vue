<template>
  <div class="page container">
    <div class="not-found">
      <div class="not-found-emoji" aria-hidden="true">🐕</div>
      <span class="not-found-code">404</span>
      <h1>这个页面被毛孩子叼走了</h1>
      <p>链接可能输错了，或者内容已经被删掉了。别担心，回首页继续逛逛吧。</p>
      <div class="not-found-actions">
        <RouterLink to="/" class="btn btn-primary">回首页</RouterLink>
        <RouterLink to="/posts" class="btn btn-ghost">去社区逛逛</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  padding-top: 40px;
}

.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 52vh;
  padding: 40px 20px;
  text-align: center;
}

.not-found-emoji {
  display: grid;
  place-items: center;
  width: 96px;
  height: 96px;
  border-radius: 32px;
  background: linear-gradient(140deg, #fff, #ffe3ce);
  box-shadow: var(--shadow-md);
  font-size: 46px;
}

.not-found-code {
  margin-top: 22px;
  color: var(--primary);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.24em;
}

.not-found h1 {
  margin-top: 8px;
  color: var(--brown);
  font-size: 25px;
}

.not-found p {
  max-width: 420px;
  margin-top: 10px;
  color: var(--muted);
  font-size: 13.5px;
  line-height: 1.8;
}

.not-found-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 24px;
}
</style>
