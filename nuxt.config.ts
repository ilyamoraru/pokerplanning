// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxt/ui', '@nuxt/icon', '@nuxt/eslint', '@pinia/nuxt'],
  nitro: {
    experimental: {
      websocket: true
    }
  },
  app: {
    head: {
      title: 'Poher-Poker',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: "description: 'Голосуй, не голосуй...'," }
      ],
      link: [{ rel: 'icon', href: '/favicon.png' }]
    }
  },
  ui: {
    fonts: false,
    colorMode: false
  },
  icon: {
    serverBundle: {
      collections: ['mdi', 'lucide']
    }
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || '/api'
    }
  },
})
