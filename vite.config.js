import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },
  server: {
    proxy: {
      '/iss': {
        target: 'http://iss.moex.com',
        changeOrigin: true,
      },
      '/cs': {
        target: 'http://iss.moex.com',
        changeOrigin: true,
      }
    }
  }
})
