import tsconfigPaths from 'vite-tsconfig-paths'
export default defineNuxtConfig({
  compatibilityDate: '2025-10-18',
  devtools: { enabled: true },
  vite: {
    plugins: [tsconfigPaths()],
  },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['@/assets/css/main.css'],
  
  // Configuration des variables d'environnement
  runtimeConfig: {
    // Privées (côté serveur uniquement)
    dbPassword: process.env.DB_PASSWORD,
    jwtSecret: process.env.JWT_SECRET,
    
    // Publiques (accessibles côté client aussi)
    public: {
      dbHost: process.env.DB_HOST,
      dbPort: process.env.DB_PORT,
      dbUser: process.env.DB_USER,
      dbName: process.env.DB_NAME
    }
  }
})