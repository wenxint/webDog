<script setup>
import { computed } from 'vue'
import SmartImage from './SmartImage.vue'
import { categoryEmoji, categoryTone } from '../utils/category'
import { excerpt, formatCount, formatTime } from '../utils/format'

const props = defineProps({
  article: { type: Object, required: true }
})

const tone = computed(() => categoryTone(props.article.category))
const emoji = computed(() => categoryEmoji(props.article.category))
const summary = computed(
  () => props.article.summary || excerpt(props.article.content, 68)
)
</script>

<template>
  <RouterLink :to="`/wiki/${article.id}`" class="article-card card">
    <SmartImage
      :src="article.cover"
      :alt="article.title"
      :emoji="emoji"
      :label="article.category || '养宠知识'"
      :tone="tone"
      ratio="thumb"
    />

    <div class="article-body">
      <span class="tag">{{ emoji }} {{ article.category || '养宠百科' }}</span>
      <h3 class="article-title">{{ article.title }}</h3>
      <p class="article-summary">{{ summary }}</p>
      <div class="article-meta">
        <span>📖 {{ formatCount(article.readCount) }} 阅读</span>
        <span class="meta-dot">·</span>
        <time>{{ formatTime(article.createdAt) }}</time>
      </div>
    </div>
  </RouterLink>
</template>

<style scoped>
.article-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.article-card:hover {
  transform: translateY(-4px);
  border-color: var(--line-strong);
  box-shadow: var(--shadow-md);
}

.article-card :deep(img) {
  transition: transform 0.4s ease;
}

.article-card:hover :deep(img) {
  transform: scale(1.04);
}

.article-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  padding: 15px 17px 16px;
}

.article-title {
  display: -webkit-box;
  overflow: hidden;
  margin: 9px 0 6px;
  color: var(--brown);
  font-size: 16px;
  line-height: 1.45;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.article-summary {
  display: -webkit-box;
  overflow: hidden;
  color: var(--text-2);
  font-size: 13px;
  line-height: 1.6;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: auto;
  padding-top: 13px;
  color: var(--muted);
  font-size: 12px;
}

.meta-dot {
  color: var(--line-strong);
}
</style>
