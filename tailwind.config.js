import containerQueries from '@tailwindcss/container-queries'
/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms'

export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'primary': '#FF6B35',
        'primary-hover': '#E85A2A',
        'accent': '#0EA5E9',
        'background-light': '#F8FAFC',
        'background-dark': '#0F172A',
        'surface-light': '#FFFFFF',
        'surface-dark': '#1E293B',
        'surface-dark-highlight': '#334155',
        'text-secondary': '#64748B',
        'border-dark': '#334155',
      },
      fontFamily: {
        display: ['"Inter"', 'sans-serif'],
        headline: ['"Inter"', 'sans-serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 4px 30px rgba(0, 0, 0, 0.08)',
        neon: '0 0 10px rgba(255, 107, 53, 0.25), 0 0 20px rgba(255, 107, 53, 0.15)',
        sport: '0 4px 20px rgba(14, 165, 233, 0.15)',
      },
    },
  },
  plugins: [forms, containerQueries],
}
