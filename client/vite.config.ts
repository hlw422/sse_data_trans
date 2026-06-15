import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/events': {
        target: 'http://localhost:13001',
        changeOrigin: true,
      },
      '/send': {
        target: 'http://localhost:13001',
        changeOrigin: true,
      },
    },
  },
})
