import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        // British Council–inspired, accessible palette
        primary: {
          50: '#eef4ff',
          100: '#d9e7ff',
          200: '#b7d0ff',
          300: '#86b0ff',
          400: '#4f89f5',
          500: '#2f6fe8',
          600: '#1f56c6',
          700: '#17439b',
          800: '#133a7e',
          900: '#0f3066'
        },
        accent: {
          50: '#effbff',
          100: '#d6f5ff',
          200: '#adebff',
          300: '#7eddff',
          400: '#49c9fb',
          500: '#1fb3ee',
          600: '#1292cb',
          700: '#1175a4',
          800: '#125f85',
          900: '#114e6e'
        },
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444'
      }
    }
  },
  plugins: []
} satisfies Config
