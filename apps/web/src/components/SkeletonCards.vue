<script setup>
defineProps({
  count: { type: Number, default: 6 },
  type: { type: String, default: 'post' } // post | article
})
</script>

<template>
  <div :class="type === 'article' ? 'grid-articles' : 'grid-posts'" aria-hidden="true">
    <div v-for="index in count" :key="index" class="skeleton-card">
      <div class="skeleton skeleton-cover" />
      <div class="skeleton skeleton-tag" />
      <div class="skeleton skeleton-line" />
      <div class="skeleton skeleton-line short" />
      <div class="skeleton skeleton-line shorter" />
    </div>
  </div>
</template>

<style scoped>
.skeleton-card {
  overflow: hidden;
  padding-bottom: 18px;
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.8);
}

.skeleton-cover {
  width: 100%;
  aspect-ratio: 16 / 10;
  border-radius: 0;
}

.skeleton-tag {
  width: 68px;
  height: 17px;
  margin: 16px 17px 10px;
  border-radius: var(--radius-full);
}

.skeleton-line {
  height: 13px;
  margin: 8px 17px;
}

.skeleton-line.short {
  width: 68%;
}

.skeleton-line.shorter {
  width: 45%;
}
</style>
