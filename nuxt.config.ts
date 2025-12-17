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
      meta: [
        { charset: 'utf-8' },

        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      title: 'Poher-Poker',
      link: [{ rel: 'icon', href: '/favicon.png' }]
    }
  }
})
