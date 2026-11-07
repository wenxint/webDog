<script setup>
import { computed, onMounted, ref } from 'vue'
import { fetchArticles, fetchCategories, fetchPosts } from '../api'
import PostCard from '../components/PostCard.vue'
import ArticleCard from '../components/ArticleCard.vue'
import SmartImage from '../components/SmartImage.vue'
import SkeletonCards from '../components/SkeletonCards.vue'
import StateBlock from '../components/StateBlock.vue'
import { categoryTone } from '../utils/category'
import { formatCount } from '../utils/format'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1200&q=80'

const categories = ref([])
const categoriesLoading = ref(true)
const categoriesError = ref('')

const posts = ref([])
const postsTotal = ref(0)
const postsLoading = ref(true)
const postsError = ref('')

const articles = ref([])
const articlesLoading = ref(true)
const articlesError = ref('')

const stats = computed(() => [
  { value: postsTotal.value ? formatCount(postsTotal.value) : '—', label: '条社区分享' },
  { value: articles.value.length ? `${articles.value.length}` : '—', label: '篇养宠知识' },
  { value: categories.value.length ? `${categories.value.length}` : '—', label: '个养宠分类' }
])

async function loadCategories() {
  categoriesLoading.value = true
  categoriesError.value = ''
  try {
    const data = await fetchCategories()
    categories.value = data.list || []
  } catch (error) {
    categoriesError.value = error.message || '分类加载失败了'
  } finally {
    categoriesLoading.value = false
  }
}

async function loadPosts() {
  postsLoading.value = true
  postsError.value = ''
  try {
    const data = await fetchPosts({ page: 1, pageSize: 6 })
    posts.value = data.list || []
    postsTotal.value = data.total || 0
  } catch (error) {
    postsError.value = error.message || '动态加载失败了'
  } finally {
    postsLoading.value = false
  }
}

async function loadArticles() {
  articlesLoading.value = true
  articlesError.value = ''
  try {
    const data = await fetchArticles()
    articles.value = data.list || []
  } catch (error) {
    articlesError.value = error.message || '百科内容加载失败了'
  } finally {
    articlesLoading.value = false
  }
}

onMounted(() => {
  loadCategories()
  loadPosts()
  loadArticles()
})
</script>

<template>
  <div class="home">
    <!-- 品牌首屏 -->
    <section class="hero">
      <div class="container hero-inner">
        <div class="hero-copy">
          <span class="hero-eyebrow">🐾 宠物社区 · 养宠百科</span>
          <h1 class="hero-title">
            每个毛孩子，
            <br />
            <em>都值得被认真照顾</em>
          </h1>
          <p class="hero-desc">
            晒晒主子的日常，看看别人的真实经验。养宠路上的大小问题，在这里慢慢都能找到答案。
          </p>
          <div class="hero-actions">
            <RouterLink to="/posts" class="btn btn-primary btn-lg">去社区逛逛</RouterLink>
            <RouterLink to="/publish" class="btn btn-ghost btn-lg">✍️ 发布动态</RouterLink>
          </div>
          <div class="hero-stats">
            <div v-for="item in stats" :key="item.label" class="hero-stat">
              <strong>{{ item.value }}</strong>
              <span>{{ item.label }}</span>
            </div>
          </div>
        </div>

        <div class="hero-visual" aria-hidden="true">
          <div class="hero-photo">
            <SmartImage
              :src="HERO_IMAGE"
              ratio="hero"
              emoji="🐶"
              label="毛孩子的日常"
              tone="dog"
              eager
            />
          </div>
          <span class="hero-float hero-float-a">🐱 猫咪日常</span>
          <span class="hero-float hero-float-b">🐶 狗狗生活</span>
          <span class="hero-note">🐾 今天也要好好陪它</span>
        </div>
      </div>
    </section>

    <div class="container home-main">
      <!-- 分类快捷入口 -->
      <section class="section categories-section">
        <div class="section-head">
          <div>
            <h2 class="section-title"><span class="emoji">🧭</span> 从哪个毛孩子开始看？</h2>
            <p class="section-sub">挑一个分类，马上进入大家的日常</p>
          </div>
        </div>

        <div v-if="categoriesLoading" class="category-grid">
          <div v-for="index in 6" :key="index" class="category-skeleton">
            <span class="skeleton skeleton-dot" />
            <span class="skeleton skeleton-line-sm" />
            <span class="skeleton skeleton-line-xs" />
          </div>
        </div>

        <div v-else-if="categoriesError" class="inline-error">
          <span>😿 {{ categoriesError }}</span>
          <button type="button" class="link-button" @click="loadCategories">重新加载</button>
        </div>

        <div v-else class="category-grid">
          <RouterLink
            v-for="category in categories"
            :key="category.slug || category.id"
            :to="{ path: '/posts', query: { category: category.slug || category.name } }"
            class="category-tile"
            :class="`tone-${categoryTone(category.slug)}`"
          >
            <span class="category-icon">{{ category.icon || '🐾' }}</span>
            <span class="category-name">{{ category.name }}</span>
            <span class="category-count">{{ category.postCount || 0 }} 条动态</span>
            <span class="category-arrow">→</span>
          </RouterLink>
        </div>
      </section>

      <!-- 热门帖子 -->
      <section class="section">
        <div class="section-head">
          <div>
            <h2 class="section-title"><span class="emoji">🔥</span> 热门动态</h2>
            <p class="section-sub">刚被铲屎官们分享出来的新鲜事</p>
          </div>
          <RouterLink to="/posts" class="section-link">查看全部 →</RouterLink>
        </div>

        <SkeletonCards v-if="postsLoading" :count="6" />

        <StateBlock
          v-else-if="postsError"
          type="error"
          title="动态加载失败了"
          :description="postsError"
          action-text="重新加载"
          @action="loadPosts"
        />

        <StateBlock
          v-else-if="!posts.length"
          title="社区还很安静"
          description="还没有人发布动态，来做第一个分享毛孩子日常的人吧。"
        >
          <RouterLink to="/publish" class="btn btn-soft btn-sm">去发布第一条</RouterLink>
        </StateBlock>

        <div v-else class="grid-posts">
          <PostCard
            v-for="post in posts"
            :key="post.id"
            :post="post"
            :categories="categories"
          />
        </div>
      </section>

      <!-- 百科推荐 -->
      <section class="section">
        <div class="section-head">
          <div>
            <h2 class="section-title"><span class="emoji">📖</span> 养宠百科</h2>
            <p class="section-sub">从新手到老手，都能查到答案</p>
          </div>
          <RouterLink to="/wiki" class="section-link">全部文章 →</RouterLink>
        </div>

        <SkeletonCards v-if="articlesLoading" type="article" :count="3" />

        <StateBlock
          v-else-if="articlesError"
          type="error"
          title="百科内容加载失败了"
          :description="articlesError"
          action-text="重新加载"
          @action="loadArticles"
        />

        <div v-else class="grid-articles">
          <ArticleCard
            v-for="article in articles.slice(0, 3)"
            :key="article.id"
            :article="article"
          />
        </div>
      </section>

      <!-- 发布引导 -->
      <section class="section">
        <div class="publish-banner">
          <span class="banner-emoji banner-emoji-a" aria-hidden="true">🐕</span>
          <span class="banner-emoji banner-emoji-b" aria-hidden="true">🐈</span>
          <div class="banner-copy">
            <h2>你家毛孩子今天有什么新鲜事？</h2>
            <p>发一条动态，让更多铲屎官认识它。</p>
          </div>
          <RouterLink to="/publish" class="btn btn-light btn-lg">✍️ 去发布</RouterLink>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.hero {
  position: relative;
  overflow: hidden;
  background: linear-gradient(128deg, #fff6ec 0%, #ffe9d6 52%, #ffdfc6 100%);
  border-bottom: 1px solid rgba(255, 214, 183, 0.6);
}

.hero::before {
  content: '';
  position: absolute;
  top: -140px;
  right: -120px;
  width: 420px;
  height: 420px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.8), transparent 68%);
  pointer-events: none;
}

.hero-inner {
  position: relative;
  display: grid;
  gap: 30px;
  padding-top: 38px;
  padding-bottom: 42px;
}

.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border: 1px solid rgba(255, 176, 132, 0.55);
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.72);
  color: var(--primary-strong);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.hero-title {
  margin-top: 18px;
  color: var(--brown);
  font-size: 33px;
  line-height: 1.28;
  letter-spacing: 0.01em;
}

.hero-title em {
  font-style: normal;
  color: var(--primary-strong);
  background-image: linear-gradient(transparent 68%, rgba(255, 183, 130, 0.55) 68%);
}

.hero-desc {
  max-width: 480px;
  margin-top: 14px;
  color: var(--text-2);
  font-size: 14px;
  line-height: 1.8;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 24px;
}

.hero-stats {
  display: flex;
  gap: 26px;
  margin-top: 30px;
  padding-top: 22px;
  border-top: 1px dashed rgba(203, 162, 129, 0.45);
}

.hero-stat {
  display: flex;
  flex-direction: column;
}

.hero-stat strong {
  color: var(--brown);
  font-size: 22px;
  line-height: 1.2;
}

.hero-stat span {
  margin-top: 3px;
  color: var(--brown-soft);
  font-size: 12px;
}

.hero-visual {
  position: relative;
  max-width: 460px;
  margin-inline: auto;
  width: 100%;
  padding: 10px 8px 26px;
}

.hero-photo {
  overflow: hidden;
  border: 7px solid #fff;
  border-radius: 26px;
  box-shadow: var(--shadow-lg);
  transform: rotate(-2deg);
}

.hero-float {
  position: absolute;
  padding: 7px 13px;
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.94);
  color: var(--brown);
  font-size: 12px;
  font-weight: 600;
  box-shadow: var(--shadow-md);
  backdrop-filter: blur(6px);
}

.hero-float-a {
  top: 20px;
  left: -2px;
  transform: rotate(-4deg);
}

.hero-float-b {
  right: -2px;
  bottom: 62px;
  transform: rotate(3deg);
}

.hero-note {
  position: absolute;
  left: 50%;
  bottom: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: var(--radius-full);
  background: var(--brown);
  color: #fff4e9;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  transform: translateX(-50%);
  box-shadow: var(--shadow-md);
}

.home-main {
  padding-top: 36px;
}

.categories-section {
  margin-top: 4px;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.category-tile {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 16px 15px;
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.86);
  box-shadow: var(--shadow-sm);
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
}

.category-tile:hover {
  transform: translateY(-3px);
  border-color: var(--line-strong);
  box-shadow: var(--shadow-md);
}

.category-icon {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  margin-bottom: 7px;
  border-radius: 13px;
  background: linear-gradient(140deg, #fff6ec, #ffe3cd);
  font-size: 19px;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.7);
}

.category-name {
  color: var(--brown);
  font-size: 14px;
  font-weight: 700;
}

.category-count {
  color: var(--muted);
  font-size: 11.5px;
}

.category-arrow {
  position: absolute;
  top: 16px;
  right: 14px;
  color: var(--line-strong);
  font-size: 15px;
  transition: color 0.18s ease, transform 0.18s ease;
}

.category-tile:hover .category-arrow {
  color: var(--primary);
  transform: translateX(2px);
}

.category-skeleton {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px 15px;
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.7);
}

.skeleton-dot {
  width: 38px;
  height: 38px;
  border-radius: 13px;
}

.skeleton-line-sm {
  width: 60%;
  height: 12px;
}

.skeleton-line-xs {
  width: 40%;
  height: 10px;
}

.inline-error {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  padding: 14px 16px;
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

.publish-banner {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 18px;
  overflow: hidden;
  padding: 30px 24px;
  border-radius: var(--radius-lg);
  background: linear-gradient(120deg, #ffb37e 0%, #ff8a4c 62%, #f97a3d 100%);
  box-shadow: 0 18px 36px rgba(255, 138, 76, 0.26);
}

.banner-copy {
  position: relative;
  z-index: 2;
}

.banner-copy h2 {
  color: #fff;
  font-size: 20px;
}

.banner-copy p {
  margin-top: 6px;
  color: rgba(255, 255, 255, 0.86);
  font-size: 13px;
}

.btn-light {
  position: relative;
  z-index: 2;
  background: #fff;
  color: var(--primary-strong);
  box-shadow: 0 10px 22px rgba(120, 60, 20, 0.18);
}

.btn-light:hover {
  background: #fff6ec;
  color: var(--primary-strong);
}

.banner-emoji {
  position: absolute;
  right: 18px;
  bottom: -14px;
  font-size: 92px;
  opacity: 0.32;
  transform: rotate(-8deg);
  pointer-events: none;
}

.banner-emoji-b {
  right: 108px;
  bottom: -22px;
  font-size: 64px;
  opacity: 0.24;
  transform: rotate(6deg);
}

@media (min-width: 640px) {
  .category-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
  }

  .publish-banner {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 34px 38px;
  }

  .banner-copy h2 {
    font-size: 23px;
  }
}

@media (min-width: 900px) {
  .hero-inner {
    grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
    align-items: center;
    gap: 48px;
    padding-top: 54px;
    padding-bottom: 58px;
  }

  .hero-title {
    font-size: 46px;
  }

  .hero-desc {
    font-size: 15px;
  }

  .hero-visual {
    max-width: 470px;
  }

  .category-grid {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }
}

@media (max-width: 420px) {
  .hero-title {
    font-size: 29px;
  }

  .hero-stats {
    gap: 18px;
  }

  .hero-float-a {
    top: 10px;
    left: 2px;
  }

  .hero-float-b {
    right: 2px;
    bottom: 56px;
  }

  .banner-emoji {
    font-size: 70px;
    right: -6px;
  }
}
</style>
