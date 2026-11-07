import { USE_MOCK, PAGE_SIZE } from './config'
import { request } from './http'
import * as mock from '../mock'

function buildQuery(params) {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      search.set(key, String(value))
    }
  })
  const query = search.toString()
  return query ? `?${query}` : ''
}

/** 当前数据来源：mock | real */
export const apiSource = USE_MOCK ? 'mock' : 'real'

export async function fetchCategories() {
  if (USE_MOCK) return mock.getCategories()
  return request('/categories')
}

export async function fetchPosts({ page = 1, pageSize = PAGE_SIZE, category = '' } = {}) {
  if (USE_MOCK) return mock.getPosts({ page, pageSize, category })
  return request(`/posts${buildQuery({ page, pageSize, category })}`)
}

export async function fetchPostDetail(id) {
  if (USE_MOCK) return mock.getPostDetail(id)
  return request(`/posts/${encodeURIComponent(id)}`)
}

export async function createPost(payload) {
  if (USE_MOCK) return mock.createPost(payload)
  return request('/posts', { method: 'POST', body: payload })
}

export async function likePost(id) {
  if (USE_MOCK) return mock.likePost(id)
  return request(`/posts/${encodeURIComponent(id)}/like`, { method: 'POST' })
}

export async function fetchArticles({ category = '' } = {}) {
  if (USE_MOCK) return mock.getArticles({ category })
  return request(`/articles${buildQuery({ category })}`)
}

export async function fetchArticleDetail(id) {
  if (USE_MOCK) return mock.getArticleDetail(id)
  return request(`/articles/${encodeURIComponent(id)}`)
}
