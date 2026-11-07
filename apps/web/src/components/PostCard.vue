<script setup>
import { computed, ref } from 'vue'
import SmartImage from './SmartImage.vue'
import { resolveCategory, categoryTone, categoryEmoji } from '../utils/category'
import { excerpt, formatCount, formatTime, isImageUrl, nameInitial } from '../utils/format'

const props = defineProps({
  post: { type: Object, required: true },
  categories: { type: Array, default: () => [] }
})

const category = computed(() => resolveCategory(props.post.category, props.categories))
const tone = computed(() => categoryTone(props.post.category))
const emoji = computed(() => category.value.icon || categoryEmoji(props.post.category))
const avatarBroken = ref(false)
const hasImageAvatar = computed(() => isImageUrl(props.post.authorAvatar) && !avatarBroken.value)
const avatarText = computed(() =>
  isImageUrl(props.post.authorAvatar)
    ? nameInitial(props.post.authorName)
    : props.post.authorAvatar || nameInitial(props.post.authorName)
)
const tag = computed(() => (Array.isArray(props.post.tags) ? props.post.tags[0] : ''))
</script>

<template>
  <RouterLink :to="`/posts/${post.id}`" class="post-card card">
    <SmartImage
      :src="post.cover"
      :alt="post.title"
      :emoji="emoji"
      :label="category.name"
      :tone="tone"
      ratio="card"
    />

    <div class="post-body">
      <div class="post-topline">
        <span class="tag">{{ emoji }} {{ category.name }}</span>
        <span v-if="tag" class="post-tag">#{{ tag }}</span>
      </div>

      <h3 class="post-title">{{ post.title }}</h3>
      <p class="post-excerpt">{{ excerpt(post.content, 60) }}</p>

      <div class="post-meta">
        <span class="author">
          <span class="avatar">
            <img
              v-if="hasImageAvatar"
              :src="post.authorAvatar"
              alt=""
              @error="avatarBroken = true"
            />
            <template v-else>{{ avatarText }}</template>
          </span>
          <span class="author-name">{{ post.authorName || '匿名铲屎官' }}</span>
        </span>
        <span class="meta-dot">·</span>
        <time class="meta-time">{{ formatTime(post.createdAt) }}</time>
        <span class="meta-spacer" />
        <span class="meta-item">❤️ {{ formatCount(post.likes) }}</span>
        <span class="meta-item">💬 {{ formatCount(post.commentsCount) }}</span>
      </div>
    </div>
  </RouterLink>
</template>

<style scoped>
.post-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.post-card:hover {
  transform: translateY(-4px);
  border-color: var(--line-strong);
  box-shadow: var(--shadow-md);
}

.post-card :deep(img) {
  transition: transform 0.4s ease;
}

.post-card:hover :deep(img) {
  transform: scale(1.04);
}

.post-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 15px 17px 16px;
}

.post-topline {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.post-tag {
  overflow: hidden;
  color: var(--muted);
  font-size: 12px;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.post-title {
  display: -webkit-box;
  overflow: hidden;
  margin: 9px 0 6px;
  color: var(--brown);
  font-size: 16.5px;
  line-height: 1.45;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.post-excerpt {
  display: -webkit-box;
  overflow: hidden;
  color: var(--text-2);
  font-size: 13px;
  line-height: 1.6;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: auto;
  padding-top: 13px;
  color: var(--muted);
  font-size: 12px;
}

.post-meta .author {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.avatar {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  overflow: hidden;
  border-radius: 50%;
  background: var(--primary-soft);
  color: var(--primary-strong);
  font-size: 11px;
  font-weight: 700;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-name {
  overflow: hidden;
  max-width: 84px;
  color: var(--text-2);
  white-space: nowrap;
  text-overflow: ellipsis;
}

.meta-spacer {
  flex: 1;
}

.meta-item {
  flex-shrink: 0;
  white-space: nowrap;
}
</style>
