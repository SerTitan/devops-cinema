// vite.config.js
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    coverage: {
      reporter: ['text', 'lcov'],
      provider: 'v8',
      reportsDirectory: './coverage'
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
