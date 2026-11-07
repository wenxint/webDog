<script setup>
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { createPost, fetchCategories } from '../api'
import CategoryChips from '../components/CategoryChips.vue'
import { useToast } from '../composables/useToast'

const router = useRouter()
const { success, error: toastError } = useToast()

const categories = ref([])
const categoriesLoading = ref(true)
const categoriesError = ref('')

const form = reactive({ title: '', category: '', content: '', authorName: '' })
const errors = reactive({ title: '', category: '', content: '', authorName: '' })
const touched = reactive({ title: false, category: false, content: false, authorName: false })
const submitting = ref(false)
const submitError = ref('')

const titleRef = ref(null)
const contentRef = ref(null)
const authorRef = ref(null)
const categorySectionRef = ref(null)

const titleLength = computed(() => form.title.length)
const contentLength = computed(() => form.content.length)

async function loadCategories() {
  categoriesLoading.value = true
  categoriesError.value = ''
  try {
    const data = await fetchCategories()
    categories.value = data.list || []
  } catch (err) {
    categoriesError.value = err.message || '分类加载失败了'
  } finally {
    categoriesLoading.value = false
  }
}

function validateField(field) {
  const value = String(form[field] || '').trim()
  if (field === 'title') {
    if (!value) return '请填写标题'
    if (value.length < 2) return '标题至少写 2 个字'
    if (value.length > 60) return '标题最多 60 个字'
    return ''
  }
  if (field === 'category') {
    return value ? '' : '请选择一个分类'
  }
  if (field === 'content') {
    if (!value) return '请填写正文'
    if (value.length < 10) return '正文至少写 10 个字，让大家看得更明白'
    if (value.length > 5000) return '正文最多 5000 个字'
    return ''
  }
  if (field === 'authorName') {
    if (!value) return '请填写昵称'
    if (value.length > 20) return '昵称最多 20 个字'
    return ''
  }
  return ''
}

function handleBlur(field) {
  touched[field] = true
  errors[field] = validateField(field)
}

function handleInput(field) {
  if (touched[field]) {
    errors[field] = validateField(field)
  }
}

function selectCategory(value) {
  form.category = value
  touched.category = true
  errors.category = validateField('category')
}

function validateAll() {
  const fields = ['title', 'category', 'content', 'authorName']
  fields.forEach((field) => {
    touched[field] = true
    errors[field] = validateField(field)
  })
  return fields.every((field) => !errors[field])
}

async function focusFirstError() {
  await nextTick()
  const field = ['title', 'category', 'content', 'authorName'].find((item) => errors[item])
  if (field === 'title') titleRef.value?.focus()
  else if (field === 'content') contentRef.value?.focus()
  else if (field === 'authorName') authorRef.value?.focus()
  else categorySectionRef.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

async function handleSubmit() {
  submitError.value = ''
  if (!validateAll()) {
    focusFirstError()
    return
  }
  submitting.value = true
  try {
    const created = await createPost({
      title: form.title.trim(),
      content: form.content.trim(),
      category: form.category,
      authorName: form.authorName.trim()
    })
    success('发布成功，正在打开你的帖子…')
    router.push({ path: `/posts/${created.id}`, query: { from: 'publish' } })
  } catch (err) {
    submitError.value = err.message || '发布失败了，请稍后再试'
    toastError(submitError.value)
  } finally {
    submitting.value = false
  }
}

onMounted(loadCategories)
</script>

<template>
  <div class="page container">
    <header class="publish-head">
      <RouterLink to="/posts" class="back-link">← 返回社区</RouterLink>
      <span class="page-eyebrow">✍️ 发布</span>
      <h1 class="page-title">分享你家毛孩子的日常</h1>
      <p class="page-sub">
        不需要注册登录，填个昵称就能发。友善交流，让每一次分享都被温柔对待。
      </p>
    </header>

    <div class="publish-layout">
      <form class="form-card card" novalidate @submit.prevent="handleSubmit">
        <div v-if="submitError" class="submit-error">😿 {{ submitError }}</div>

        <div class="field">
          <div class="field-head">
            <label class="field-label" for="post-title">标题 <em>*</em></label>
            <span class="counter">{{ titleLength }}/60</span>
          </div>
          <input
            id="post-title"
            ref="titleRef"
            v-model="form.title"
            type="text"
            maxlength="60"
            class="input"
            :class="{ invalid: errors.title }"
            placeholder="例如：橘猫第一次见到雪，在窗边坐了半天"
            @blur="handleBlur('title')"
            @input="handleInput('title')"
          />
          <p v-if="errors.title" class="field-error">{{ errors.title }}</p>
        </div>

        <div ref="categorySectionRef" class="field">
          <div class="field-head">
            <span class="field-label">分类 <em>*</em></span>
            <span class="field-hint">选一个最贴近的分类</span>
          </div>
          <p v-if="categoriesLoading" class="field-loading">
            <span class="spinner" /> 分类加载中…
          </p>
          <p v-else-if="categoriesError" class="field-error">
            {{ categoriesError }}
            <button type="button" class="link-button" @click="loadCategories">重试</button>
          </p>
          <CategoryChips
            v-else
            :categories="categories"
            :model-value="form.category"
            :show-all="false"
            @update:model-value="selectCategory"
          />
          <p v-if="errors.category" class="field-error">{{ errors.category }}</p>
        </div>

        <div class="field">
          <div class="field-head">
            <label class="field-label" for="post-content">正文 <em>*</em></label>
            <span class="counter">{{ contentLength }}/5000</span>
          </div>
          <textarea
            id="post-content"
            ref="contentRef"
            v-model="form.content"
            class="textarea"
            :class="{ invalid: errors.content }"
            maxlength="5000"
            rows="8"
            placeholder="说说当时的场景、毛孩子的反应，或者你踩过的坑…"
            @blur="handleBlur('content')"
            @input="handleInput('content')"
          />
          <p v-if="errors.content" class="field-error">{{ errors.content }}</p>
        </div>

        <div class="field">
          <div class="field-head">
            <label class="field-label" for="post-author">昵称 <em>*</em></label>
            <span class="field-hint">按你希望被称呼的方式填写</span>
          </div>
          <input
            id="post-author"
            ref="authorRef"
            v-model="form.authorName"
            type="text"
            maxlength="20"
            class="input"
            :class="{ invalid: errors.authorName }"
            placeholder="例如：布丁的铲屎官"
            @blur="handleBlur('authorName')"
            @input="handleInput('authorName')"
          />
          <p v-if="errors.authorName" class="field-error">{{ errors.authorName }}</p>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary btn-lg submit-btn" :disabled="submitting">
            <span v-if="submitting" class="spinner spinner-light" />
            {{ submitting ? '正在发布…' : '发布动态' }}
          </button>
          <RouterLink to="/posts" class="btn btn-ghost btn-lg">取消</RouterLink>
        </div>
      </form>

      <aside class="side-col">
        <div class="tips-card card">
          <h2>🐾 怎么写更容易被看到？</h2>
          <ul>
            <li>
              <strong>标题写具体</strong>
              <span>带上品种、场景或小冲突，比「今天很开心」更吸引人。</span>
            </li>
            <li>
              <strong>正文有细节</strong>
              <span>发生了什么、毛孩子怎么反应、你当时是什么感受。</span>
            </li>
            <li>
              <strong>封面交给社区</strong>
              <span>首版会自动匹配一张封面图，把注意力留给内容本身。</span>
            </li>
          </ul>
        </div>

        <div class="rules-card card">
          <h3>社区小约定</h3>
          <p>
            友善交流，不发布攻击性内容。涉及健康的经验仅供参考，紧急情况请及时就医。
          </p>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.page {
  max-width: 1040px;
  padding-top: 30px;
}

.publish-head {
  margin-bottom: 24px;
}

.back-link {
  display: block;
  width: fit-content;
  margin-bottom: 16px;
  color: var(--text-2);
  font-size: 13px;
  font-weight: 600;
}

.back-link:hover {
  color: var(--primary-strong);
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
}

.page-sub {
  max-width: 560px;
  margin-top: 8px;
  color: var(--muted);
  font-size: 13.5px;
  line-height: 1.75;
}

.publish-layout {
  display: grid;
  gap: 22px;
}

/* grid 子项默认 min-width:auto，会被分类 chips 的横向滚动内容撑宽，这里显式收住 */
.publish-layout > * {
  min-width: 0;
}

.form-card {
  padding: 22px 20px 24px;
}

.submit-error {
  margin-bottom: 18px;
  padding: 11px 14px;
  border: 1px solid #f3cfc7;
  border-radius: 12px;
  background: #fff5f2;
  color: #a8442f;
  font-size: 13px;
}

.field {
  margin-bottom: 22px;
}

.field-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
}

.field-label {
  color: var(--brown);
  font-size: 14px;
  font-weight: 700;
}

.field-label em {
  color: var(--red);
  font-style: normal;
}

.counter {
  color: var(--muted);
  font-size: 11.5px;
  font-variant-numeric: tabular-nums;
}

.field-hint {
  color: var(--muted);
  font-size: 11.5px;
}

.input,
.textarea {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid var(--line-strong);
  border-radius: 14px;
  background: #fffdfa;
  color: var(--text);
  font-size: 16px;
  line-height: 1.6;
  transition: border-color 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
}

.input::placeholder,
.textarea::placeholder {
  color: #c3ae9e;
}

.input:focus,
.textarea:focus {
  border-color: var(--primary);
  background: #fff;
  outline: none;
  box-shadow: 0 0 0 4px rgba(255, 138, 76, 0.12);
}

.textarea {
  min-height: 180px;
  resize: vertical;
}

.input.invalid,
.textarea.invalid {
  border-color: #eaa08f;
  background: #fffaf9;
}

.field-error {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 7px;
  color: #c05238;
  font-size: 12.5px;
  line-height: 1.5;
}

.field-loading {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--muted);
  font-size: 13px;
}

.link-button {
  padding: 0;
  border: none;
  background: none;
  color: var(--primary-strong);
  font-size: 12.5px;
  font-weight: 600;
}

.link-button:hover {
  text-decoration: underline;
}

.form-actions {
  display: flex;
  flex-direction: column-reverse;
  gap: 10px;
  padding-top: 6px;
}

.submit-btn {
  gap: 8px;
}

.spinner-light {
  border-color: rgba(255, 255, 255, 0.35);
  border-top-color: #fff;
}

.side-col {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tips-card {
  padding: 22px 20px;
}

.tips-card h2 {
  color: var(--brown);
  font-size: 16px;
}

.tips-card ul {
  margin-top: 14px;
}

.tips-card li {
  position: relative;
  padding: 0 0 14px 20px;
}

.tips-card li::before {
  content: '🐾';
  position: absolute;
  top: 1px;
  left: 0;
  font-size: 12px;
}

.tips-card li:last-child {
  padding-bottom: 0;
}

.tips-card strong {
  display: block;
  color: var(--text);
  font-size: 13.5px;
}

.tips-card span {
  display: block;
  margin-top: 3px;
  color: var(--muted);
  font-size: 12.5px;
  line-height: 1.65;
}

.rules-card {
  padding: 18px 20px;
  background: var(--surface-warm);
}

.rules-card h3 {
  color: var(--brown);
  font-size: 14px;
}

.rules-card p {
  margin-top: 8px;
  color: var(--text-2);
  font-size: 12.5px;
  line-height: 1.75;
}

@media (min-width: 640px) {
  .form-card {
    padding: 30px 32px 32px;
  }

  .form-actions {
    flex-direction: row;
    align-items: center;
  }

  .input,
  .textarea {
    font-size: 15px;
  }

  .submit-btn {
    min-width: 168px;
  }
}

@media (min-width: 900px) {
  .page-title {
    font-size: 32px;
  }

  .publish-layout {
    grid-template-columns: minmax(0, 1fr) 320px;
    align-items: start;
    gap: 26px;
  }

  .side-col {
    position: sticky;
    top: 86px;
  }
}
</style>
