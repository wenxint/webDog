import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Web 端口固定 5173，/api 代理到本地 3001 的 API 服务
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  },
  preview: {
    port: 5173,
    strictPort: true
  }
})
