import tsconfigPaths from 'vite-tsconfig-paths'
export default defineNuxtConfig({
  devtools: { enabled: true },
  vite: {
    plugins: [tsconfigPaths()],
  },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['@/assets/css/main.css']
})