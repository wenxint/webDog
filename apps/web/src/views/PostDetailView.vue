<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { fetchPostDetail, likePost } from '../api'
import SmartImage from '../components/SmartImage.vue'
import UserAvatar from '../components/UserAvatar.vue'
import StateBlock from '../components/StateBlock.vue'
import { useToast } from '../composables/useToast'
import { categoryEmoji, categoryTone, resolveCategory } from '../utils/category'
import { formatCount, formatTime, splitParagraphs } from '../utils/format'

const route = useRoute()
const { success: toastSuccess, error: toastError } = useToast()

const post = ref(null)
const loading = ref(true)
const error = ref('')
const liked = ref(false)
const likeLoading = ref(false)

const comments = computed(() =>
  Array.isArray(post.value?.comments) ? post.value.comments : []
)
const commentCount = computed(() =>
  typeof post.value?.commentsCount === 'number' ? post.value.commentsCount : comments.value.length
)
const category = computed(() => resolveCategory(post.value?.category, []))
const tone = computed(() => categoryTone(post.value?.category))
const emoji = computed(() => category.value.icon || categoryEmoji(post.value?.category))
const paragraphs = computed(() => splitParagraphs(post.value?.content))
const tags = computed(() =>
  Array.isArray(post.value?.tags) ? post.value.tags.filter(Boolean) : []
)

async function load(id) {
  if (!id) return
  loading.value = true
  error.value = ''
  post.value = null
  liked.value = false
  try {
    const data = await fetchPostDetail(id)
    post.value = data
    document.title = `${data.title || '帖子详情'} · 宠物社区`
  } catch (err) {
    error.value = err.message || '帖子加载失败了'
  } finally {
    loading.value = false
  }
}

async function handleLike() {
  if (!post.value || likeLoading.value || liked.value) return
  likeLoading.value = true
  try {
    const result = await likePost(post.value.id)
    if (result && typeof result.likes === 'number') {
      post.value.likes = result.likes
    } else {
      post.value.likes = (Number(post.value.likes) || 0) + 1
    }
    liked.value = true
    toastSuccess('点赞成功，谢谢你的喜欢 🧡')
  } catch (err) {
    toastError(err.message || '点赞失败了，请稍后再试')
  } finally {
    likeLoading.value = false
  }
}

watch(
  () => route.params.id,
  (id) => {
    if (id) load(id)
  },
  { immediate: true }
)
</script>

<template>
  <div class="page container">
    <div class="detail-topbar">
      <RouterLink to="/posts" class="back-link">← 返回社区动态</RouterLink>
      <span class="detail-crumb">社区 / 帖子详情</span>
    </div>

    <div v-if="loading" class="detail-skeleton card">
      <div class="skeleton skeleton-cover" />
      <div class="skeleton-body">
        <div class="skeleton line-tag" />
        <div class="skeleton line-title" />
        <div class="skeleton line-title short" />
        <div class="skeleton line-meta" />
        <div class="skeleton line" />
        <div class="skeleton line" />
        <div class="skeleton line short" />
      </div>
    </div>

    <StateBlock
      v-else-if="error"
      type="error"
      title="帖子加载失败了"
      :description="error"
      action-text="重新加载"
      @action="load(route.params.id)"
    >
      <RouterLink to="/posts" class="btn btn-ghost btn-sm">返回社区动态</RouterLink>
    </StateBlock>

    <template v-else-if="post">
      <article class="detail-card card">
        <SmartImage
          :src="post.cover"
          :alt="post.title"
          :emoji="emoji"
          :label="category.name"
          :tone="tone"
          ratio="hero"
          eager
        />

        <div class="detail-body">
          <span class="tag">{{ emoji }} {{ category.name }}</span>
          <h1 class="detail-title">{{ post.title }}</h1>

          <div class="detail-meta">
            <UserAvatar :name="post.authorName" :avatar="post.authorAvatar" :size="38" />
            <div class="author-info">
              <strong>{{ post.authorName || '匿名铲屎官' }}</strong>
              <span>{{ formatTime(post.createdAt) }} 发布</span>
            </div>
            <div class="detail-stats">
              <span>❤️ {{ formatCount(post.likes) }}</span>
              <span>💬 {{ formatCount(commentCount) }}</span>
            </div>
          </div>

          <div class="detail-content">
            <p v-for="(paragraph, index) in paragraphs" :key="index">{{ paragraph }}</p>
          </div>

          <div v-if="tags.length" class="detail-tags">
            <span v-for="tag in tags" :key="tag" class="detail-tag">#{{ tag }}</span>
          </div>

          <div class="detail-actions">
            <button
              type="button"
              class="like-btn"
              :class="{ liked }"
              :disabled="likeLoading || liked"
              @click="handleLike"
            >
              <span class="like-icon" aria-hidden="true">{{ liked ? '🧡' : '🤍' }}</span>
              <span>{{ liked ? '已点赞' : '点赞' }}</span>
              <span class="like-count">{{ formatCount(post.likes) }}</span>
            </button>
            <span class="action-hint">喜欢这条分享，就给它一个鼓励吧</span>
          </div>
        </div>
      </article>

      <section class="comments-card card">
        <div class="comments-head">
          <h2>评论 <span>{{ commentCount }}</span></h2>
          <span class="comments-note">友善交流，文明晒宠</span>
        </div>

        <ul v-if="comments.length" class="comment-list">
          <li v-for="comment in comments" :key="comment.id" class="comment-item">
            <UserAvatar
              :name="comment.authorName"
              :avatar="comment.authorAvatar"
              :size="34"
            />
            <div class="comment-main">
              <div class="comment-top">
                <strong>{{ comment.authorName || '匿名铲屎官' }}</strong>
                <time>{{ formatTime(comment.createdAt) }}</time>
              </div>
              <p>{{ comment.content }}</p>
            </div>
          </li>
        </ul>

        <StateBlock
          v-else
          compact
          title="还没有评论"
          description="第一条评论，就留给你了。"
        />
      </section>
    </template>
  </div>
</template>

<style scoped>
.page {
  max-width: 880px;
  padding-top: 22px;
}

.detail-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.back-link {
  color: var(--text-2);
  font-size: 13px;
  font-weight: 600;
  transition: color 0.16s ease;
}

.back-link:hover {
  color: var(--primary-strong);
}

.detail-crumb {
  color: var(--muted);
  font-size: 12px;
}

.detail-card {
  overflow: hidden;
}

.detail-body {
  padding: 22px 20px 26px;
}

.detail-title {
  margin: 12px 0 16px;
  color: var(--brown);
  font-size: 25px;
  line-height: 1.42;
}

.detail-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 18px;
  border-bottom: 1px dashed var(--line);
}

.author-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.author-info strong {
  overflow: hidden;
  color: var(--text);
  font-size: 13.5px;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.author-info span {
  margin-top: 2px;
  color: var(--muted);
  font-size: 11.5px;
}

.detail-stats {
  display: flex;
  gap: 14px;
  margin-left: auto;
  color: var(--muted);
  font-size: 12px;
  white-space: nowrap;
}

.detail-content {
  padding: 20px 0 6px;
}

.detail-content p {
  margin-bottom: 16px;
  color: var(--text);
  font-size: 15px;
  line-height: 1.95;
  letter-spacing: 0.01em;
}

.detail-content p:last-child {
  margin-bottom: 0;
}

.detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

.detail-tag {
  padding: 4px 11px;
  border-radius: var(--radius-full);
  background: var(--surface-warm);
  color: var(--brown-soft);
  font-size: 12px;
  font-weight: 600;
}

.detail-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  margin-top: 26px;
  padding-top: 22px;
  border-top: 1px dashed var(--line);
}

.like-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 22px;
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-full);
  background: #fff;
  color: var(--brown);
  font-size: 14px;
  font-weight: 700;
  transition: all 0.18s ease;
}

.like-btn:hover:not(:disabled) {
  border-color: var(--primary);
  color: var(--primary-strong);
  box-shadow: 0 8px 18px rgba(255, 138, 76, 0.16);
  transform: translateY(-1px);
}

.like-btn.liked,
.like-btn.liked:disabled {
  border-color: transparent;
  background: linear-gradient(135deg, #ffa469, var(--primary));
  color: #fff;
  opacity: 1;
  box-shadow: 0 10px 20px rgba(255, 138, 76, 0.28);
}

.like-icon {
  font-size: 17px;
  line-height: 1;
}

.like-count {
  padding: 1px 9px;
  border-radius: var(--radius-full);
  background: rgba(255, 138, 76, 0.12);
  color: var(--primary-strong);
  font-size: 12.5px;
}

.like-btn.liked .like-count {
  background: rgba(255, 255, 255, 0.24);
  color: #fff;
}

.action-hint {
  color: var(--muted);
  font-size: 12px;
}

.comments-card {
  margin-top: 20px;
  padding: 24px 20px 26px;
}

.comments-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px dashed var(--line);
}

.comments-head h2 {
  color: var(--brown);
  font-size: 17px;
}

.comments-head h2 span {
  margin-left: 4px;
  color: var(--primary-strong);
  font-size: 13px;
  font-weight: 700;
}

.comments-note {
  color: var(--muted);
  font-size: 11.5px;
}

.comment-list {
  padding-top: 6px;
}

.comment-item {
  display: flex;
  gap: 11px;
  padding: 16px 0;
  border-bottom: 1px solid var(--line);
}

.comment-item:last-child {
  border-bottom: none;
  padding-bottom: 2px;
}

.comment-main {
  flex: 1;
  min-width: 0;
}

.comment-top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
}

.comment-top strong {
  color: var(--text);
  font-size: 13px;
}

.comment-top time {
  color: var(--muted);
  font-size: 11.5px;
}

.comment-main p {
  margin-top: 5px;
  color: var(--text-2);
  font-size: 13.5px;
  line-height: 1.75;
}

/* 骨架屏 */
.detail-skeleton {
  overflow: hidden;
}

.skeleton-cover {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 0;
}

.skeleton-body {
  padding: 24px 20px 30px;
}

.line-tag {
  width: 76px;
  height: 20px;
  border-radius: var(--radius-full);
}

.line-title {
  width: 86%;
  height: 24px;
  margin-top: 16px;
}

.line-title.short {
  width: 58%;
  margin-top: 10px;
}

.line-meta {
  width: 45%;
  height: 14px;
  margin: 22px 0;
}

.line {
  width: 100%;
  height: 13px;
  margin: 12px 0;
}

.line.short {
  width: 64%;
}

@media (min-width: 640px) {
  .detail-body {
    padding: 28px 36px 34px;
  }

  .detail-title {
    font-size: 30px;
  }

  .detail-content p {
    font-size: 15.5px;
  }

  .detail-actions {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .comments-card {
    padding: 26px 36px 30px;
  }
}
</style>
