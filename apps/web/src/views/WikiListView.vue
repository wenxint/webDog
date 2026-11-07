<script setup>
import { computed, onMounted, ref } from 'vue'
import { fetchArticles } from '../api'
import ArticleCard from '../components/ArticleCard.vue'
import CategoryChips from '../components/CategoryChips.vue'
import SkeletonCards from '../components/SkeletonCards.vue'
import StateBlock from '../components/StateBlock.vue'
import { categoryEmoji } from '../utils/category'

const articles = ref([])
const loading = ref(true)
const error = ref('')
const activeCategory = ref('')

const articleCategories = computed(() => {
  const map = new Map()
  articles.value.forEach((article) => {
    const name = article.category || '养宠知识'
    if (!map.has(name)) {
      map.set(name, {
        id: map.size + 1,
        name,
        slug: name,
        icon: categoryEmoji(name),
        postCount: 0
      })
    }
    map.get(name).postCount += 1
  })
  return [...map.values()]
})

const filteredArticles = computed(() =>
  activeCategory.value
    ? articles.value.filter((article) => (article.category || '养宠知识') === activeCategory.value)
    : articles.value
)

async function loadArticles() {
  loading.value = true
  error.value = ''
  try {
    const data = await fetchArticles()
    articles.value = data.list || []
  } catch (err) {
    error.value = err.message || '百科文章加载失败了'
  } finally {
    loading.value = false
  }
}

onMounted(loadArticles)
</script>

<template>
  <div class="page container">
    <header class="page-head">
      <div>
        <span class="page-eyebrow">📖 养宠百科</span>
        <h1 class="page-title">把养宠这件事，讲明白</h1>
        <p class="page-sub">
          新手入门、健康养护、科学喂养、行为训练……社区里被反复验证的经验，整理成能看懂、能照做的答案。
        </p>
      </div>
    </header>

    <div class="wiki-note">
      <span aria-hidden="true">💡</span>
      <span>内容由社区经验整理，具体健康问题请以兽医面诊为准。</span>
    </div>

    <div class="toolbar">
      <CategoryChips v-model="activeCategory" :categories="articleCategories" />
      <p v-if="!loading && !error" class="toolbar-count">共 {{ filteredArticles.length }} 篇文章</p>
    </div>

    <SkeletonCards v-if="loading" type="article" :count="6" />

    <StateBlock
      v-else-if="error"
      type="error"
      title="百科文章加载失败了"
      :description="error"
      action-text="重新加载"
      @action="loadArticles"
    />

    <StateBlock
      v-else-if="!filteredArticles.length"
      :title="activeCategory ? '这个分类下还没有文章' : '百科还没有文章'"
      description="换个分类看看，或者去社区里找找相关经验。"
    >
      <div class="empty-actions">
        <button
          v-if="activeCategory"
          type="button"
          class="btn btn-ghost btn-sm"
          @click="activeCategory = ''"
        >
          查看全部文章
        </button>
        <RouterLink to="/posts" class="btn btn-soft btn-sm">去社区逛逛</RouterLink>
      </div>
    </StateBlock>

    <div v-else class="grid-articles">
      <ArticleCard
        v-for="article in filteredArticles"
        :key="article.id"
        :article="article"
      />
    </div>
  </div>
</template>

<style scoped>
.page {
  padding-top: 34px;
}

.page-head {
  margin-bottom: 18px;
}

.page-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--primary-strong);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.page-title {
  margin-top: 7px;
  color: var(--brown);
  font-size: 27px;
}

.page-sub {
  max-width: 620px;
  margin-top: 9px;
  color: var(--muted);
  font-size: 13.5px;
  line-height: 1.8;
}

.wiki-note {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 18px;
  padding: 11px 15px;
  border: 1px solid rgba(255, 213, 179, 0.8);
  border-radius: 13px;
  background: rgba(255, 244, 233, 0.8);
  color: var(--brown-soft);
  font-size: 12.5px;
  line-height: 1.6;
}

.toolbar {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 20px;
  padding-bottom: 4px;
  border-bottom: 1px dashed var(--line);
}

.toolbar-count {
  display: none;
  flex-shrink: 0;
  padding-bottom: 8px;
  color: var(--muted);
  font-size: 12px;
}

.empty-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

@media (min-width: 640px) {
  .toolbar {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
  }

  .toolbar-count {
    display: block;
  }
}

@media (min-width: 900px) {
  .page-title {
    font-size: 32px;
  }
}
</style>
