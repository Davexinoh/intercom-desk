import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: [
      'fb55373f-75cf-464f-ad15-8f103ad5fb3a-00-14o2hg3er2c5m.kirk.replit.dev',
      '.replit.app',
      '.replit.dev'
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
