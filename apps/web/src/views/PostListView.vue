<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchCategories, fetchPosts } from '../api'
import { PAGE_SIZE } from '../api/config'
import PostCard from '../components/PostCard.vue'
import CategoryChips from '../components/CategoryChips.vue'
import SkeletonCards from '../components/SkeletonCards.vue'
import StateBlock from '../components/StateBlock.vue'

const route = useRoute()
const router = useRouter()

const categories = ref([])
const categoriesError = ref('')

const posts = ref([])
const total = ref(0)
const page = ref(1)
const loading = ref(true)
const loadingMore = ref(false)
const error = ref('')
const moreError = ref('')

const activeCategory = computed(() => String(route.query.category || ''))
const hasMore = computed(() => posts.value.length < total.value)

let requestSeed = 0

async function loadCategories() {
  categoriesError.value = ''
  try {
    const data = await fetchCategories()
    categories.value = data.list || []
  } catch (err) {
    categoriesError.value = err.message || '分类加载失败了'
  }
}

async function loadFirstPage() {
  const token = ++requestSeed
  loading.value = true
  error.value = ''
  moreError.value = ''
  posts.value = []
  total.value = 0
  page.value = 1
  try {
    const data = await fetchPosts({
      page: 1,
      pageSize: PAGE_SIZE,
      category: activeCategory.value
    })
    if (token !== requestSeed) return
    posts.value = data.list || []
    total.value = data.total || 0
    page.value = data.page || 1
  } catch (err) {
    if (token !== requestSeed) return
    error.value = err.message || '帖子加载失败了'
  } finally {
    if (token === requestSeed) loading.value = false
  }
}

async function loadMore() {
  if (loadingMore.value || loading.value || !hasMore.value) return
  loadingMore.value = true
  moreError.value = ''
  try {
    const nextPage = page.value + 1
    const data = await fetchPosts({
      page: nextPage,
      pageSize: PAGE_SIZE,
      category: activeCategory.value
    })
    posts.value = [...posts.value, ...(data.list || [])]
    total.value = typeof data.total === 'number' ? data.total : total.value
    page.value = data.page || nextPage
  } catch (err) {
    moreError.value = err.message || '加载更多失败了'
  } finally {
    loadingMore.value = false
  }
}

function selectCategory(value) {
  const query = value ? { category: value } : {}
  router.replace({ path: '/posts', query })
}

watch(activeCategory, () => {
  loadFirstPage()
})

onMounted(() => {
  loadCategories()
  loadFirstPage()
})
</script>

<template>
  <div class="page container">
    <header class="page-head">
      <div>
        <span class="page-eyebrow">🐾 社区</span>
        <h1 class="page-title">社区动态</h1>
        <p class="page-sub">看看别人家的毛孩子今天在干嘛，也分享你家的。</p>
      </div>
      <RouterLink to="/publish" class="btn btn-primary page-head-cta">✍️ 发布动态</RouterLink>
    </header>

    <div class="toolbar">
      <CategoryChips
        :categories="categories"
        :model-value="activeCategory"
        @update:model-value="selectCategory"
      />
      <p v-if="!loading && !error" class="toolbar-count">共 {{ total }} 条动态</p>
    </div>

    <p v-if="categoriesError" class="inline-error">
      <span>😿 {{ categoriesError }}</span>
      <button type="button" class="link-button" @click="loadCategories">重新加载分类</button>
    </p>

    <SkeletonCards v-if="loading" :count="6" />

    <StateBlock
      v-else-if="error"
      type="error"
      title="动态加载失败了"
      :description="error"
      action-text="重新加载"
      @action="loadFirstPage"
    />

    <StateBlock
      v-else-if="!posts.length"
      :title="activeCategory ? '这个分类下还没有动态' : '这里还没有动态'"
      description="换个分类逛逛，或者成为第一个分享的人。"
    >
      <div class="empty-actions">
        <button
          v-if="activeCategory"
          type="button"
          class="btn btn-ghost btn-sm"
          @click="selectCategory('')"
        >
          看看全部动态
        </button>
        <RouterLink to="/publish" class="btn btn-soft btn-sm">去发布一条</RouterLink>
      </div>
    </StateBlock>

    <template v-else>
      <div class="grid-posts">
        <PostCard
          v-for="post in posts"
          :key="post.id"
          :post="post"
          :categories="categories"
        />
      </div>

      <div class="list-footer">
        <div v-if="moreError" class="more-error">
          <span>😿 {{ moreError }}</span>
          <button type="button" class="link-button" @click="loadMore">重试</button>
        </div>
        <button
          v-else-if="hasMore"
          type="button"
          class="btn btn-ghost load-more"
          :disabled="loadingMore"
          @click="loadMore"
        >
          <span v-if="loadingMore" class="spinner" />
          {{ loadingMore ? '正在加载…' : '加载更多动态' }}
        </button>
        <p v-else class="list-end">🐾 已经看到底啦，共 {{ total }} 条动态</p>
      </div>
    </template>
  </div>
</template>

<style scoped>
.page {
  padding-top: 34px;
}

.page-head {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 22px;
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
  margin-top: 6px;
  color: var(--brown);
  font-size: 27px;
  letter-spacing: 0.01em;
}

.page-sub {
  margin-top: 7px;
  color: var(--muted);
  font-size: 13.5px;
}

.page-head-cta {
  align-self: flex-start;
}

.toolbar {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 18px;
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

.inline-error {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 16px;
  padding: 12px 15px;
  border: 1px dashed var(--line-strong);
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.7);
  color: var(--muted);
  font-size: 13px;
}

.link-button {
  padding: 0;
  border: none;
  background: none;
  color: var(--primary-strong);
  font-size: 13px;
  font-weight: 600;
}

.link-button:hover {
  text-decoration: underline;
}

.empty-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.list-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 30px 0 8px;
}

.load-more {
  min-width: 200px;
}

.more-error {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--muted);
  font-size: 13px;
}

.list-end {
  color: var(--muted);
  font-size: 12.5px;
}

@media (min-width: 640px) {
  .page-head {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }

  .page-head-cta {
    align-self: auto;
    flex-shrink: 0;
  }

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
