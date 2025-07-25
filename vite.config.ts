import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      strict: false
    },
    proxy: {
      '/auth': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      },
      '/me': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      },
      '/admin': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      },
      '/billing': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      },
      '/telegapay': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      },
      '/crm': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
})
