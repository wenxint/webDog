<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { fetchArticleDetail, fetchArticles } from '../api'
import SmartImage from '../components/SmartImage.vue'
import ArticleCard from '../components/ArticleCard.vue'
import StateBlock from '../components/StateBlock.vue'
import { categoryEmoji, categoryTone } from '../utils/category'
import { formatCount, formatTime, splitParagraphs } from '../utils/format'

const route = useRoute()

const article = ref(null)
const related = ref([])
const loading = ref(true)
const error = ref('')

const tone = computed(() => categoryTone(article.value?.category))
const emoji = computed(() => categoryEmoji(article.value?.category))
const paragraphs = computed(() => splitParagraphs(article.value?.content))

async function load(id) {
  if (!id) return
  loading.value = true
  error.value = ''
  article.value = null
  related.value = []
  try {
    const [detailResult, listResult] = await Promise.allSettled([
      fetchArticleDetail(id),
      fetchArticles()
    ])
    if (detailResult.status === 'rejected') {
      throw detailResult.reason
    }
    article.value = detailResult.value
    document.title = `${article.value.title} · 养宠百科 · 宠物社区`
    if (listResult.status === 'fulfilled') {
      const list = listResult.value.list || []
      related.value = list
        .filter(
          (item) =>
            String(item.id) !== String(id) && item.category === article.value.category
        )
        .slice(0, 3)
    }
  } catch (err) {
    error.value = err.message || '文章加载失败了'
  } finally {
    loading.value = false
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
      <RouterLink to="/wiki" class="back-link">← 返回养宠百科</RouterLink>
      <span class="detail-crumb">百科 / 文章详情</span>
    </div>

    <div v-if="loading" class="article-skeleton card">
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
      title="文章加载失败了"
      :description="error"
      action-text="重新加载"
      @action="load(route.params.id)"
    >
      <RouterLink to="/wiki" class="btn btn-ghost btn-sm">返回养宠百科</RouterLink>
    </StateBlock>

    <template v-else-if="article">
      <article class="article-card card">
        <SmartImage
          :src="article.cover"
          :alt="article.title"
          :emoji="emoji"
          :label="article.category || '养宠知识'"
          :tone="tone"
          ratio="hero"
          eager
        />

        <div class="article-body">
          <span class="tag">{{ emoji }} {{ article.category || '养宠百科' }}</span>
          <h1 class="article-title">{{ article.title }}</h1>

          <div class="article-meta">
            <span>📖 {{ formatCount(article.readCount) }} 阅读</span>
            <span class="meta-dot">·</span>
            <time>{{ formatTime(article.createdAt) }}更新</time>
          </div>

          <p v-if="article.summary" class="article-summary">{{ article.summary }}</p>

          <div class="article-content">
            <p v-for="(paragraph, index) in paragraphs" :key="index">{{ paragraph }}</p>
          </div>

          <div class="article-note">
            <span aria-hidden="true">💡</span>
            <p>
              本文为社区经验整理，不能替代兽医诊断。毛孩子出现持续不适时，请尽快就医。
            </p>
          </div>
        </div>
      </article>

      <section v-if="related.length" class="related-section">
        <div class="section-head">
          <div>
            <h2 class="section-title"><span class="emoji">📚</span> 相关阅读</h2>
            <p class="section-sub">同一个分类下，也许还有你需要的答案</p>
          </div>
          <RouterLink to="/wiki" class="section-link">全部文章 →</RouterLink>
        </div>
        <div class="grid-articles">
          <ArticleCard
            v-for="item in related"
            :key="item.id"
            :article="item"
          />
        </div>
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
}

.back-link:hover {
  color: var(--primary-strong);
}

.detail-crumb {
  color: var(--muted);
  font-size: 12px;
}

.article-card {
  overflow: hidden;
}

.article-body {
  padding: 22px 20px 26px;
}

.article-title {
  margin: 12px 0 14px;
  color: var(--brown);
  font-size: 25px;
  line-height: 1.42;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 7px;
  padding-bottom: 18px;
  border-bottom: 1px dashed var(--line);
  color: var(--muted);
  font-size: 12px;
}

.meta-dot {
  color: var(--line-strong);
}

.article-summary {
  margin-top: 20px;
  padding: 14px 16px;
  border-left: 3px solid var(--primary);
  border-radius: 0 12px 12px 0;
  background: var(--surface-warm);
  color: var(--text-2);
  font-size: 13.5px;
  line-height: 1.8;
}

.article-content {
  padding-top: 20px;
}

.article-content p {
  margin-bottom: 16px;
  color: var(--text);
  font-size: 15px;
  line-height: 1.95;
}

.article-content p:last-child {
  margin-bottom: 0;
}

.article-note {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  margin-top: 24px;
  padding: 13px 15px;
  border: 1px dashed var(--line-strong);
  border-radius: 13px;
  background: rgba(255, 247, 239, 0.8);
}

.article-note span {
  font-size: 15px;
  line-height: 1.5;
}

.article-note p {
  color: var(--muted);
  font-size: 12.5px;
  line-height: 1.7;
}

.related-section {
  margin-top: 30px;
}

/* 骨架屏 */
.article-skeleton {
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
  width: 82px;
  height: 20px;
  border-radius: var(--radius-full);
}

.line-title {
  width: 86%;
  height: 24px;
  margin-top: 16px;
}

.line-title.short {
  width: 56%;
  margin-top: 10px;
}

.line-meta {
  width: 40%;
  height: 14px;
  margin: 22px 0;
}

.line {
  width: 100%;
  height: 13px;
  margin: 12px 0;
}

.line.short {
  width: 62%;
}

@media (min-width: 640px) {
  .article-body {
    padding: 28px 36px 34px;
  }

  .article-title {
    font-size: 30px;
  }

  .article-content p {
    font-size: 15.5px;
  }
}
</style>
