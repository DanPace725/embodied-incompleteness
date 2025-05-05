/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          // Dark mode colors
          background: '#111827',     // slate-900 equivalent
          surface: '#1f2937',        // slate-800 equivalent
          foreground: '#f1f5f9',     // slate-100 equivalent
          muted: '#94a3b8',          // slate-400 equivalent
          accent: {
            primary: '#3b82f6',      // blue-500
            secondary: '#0ea5e9'      // sky-500
          }
        }
      },
    },
    plugins: [],
  }