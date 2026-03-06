// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/ui'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2025-01-15',

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1.0, viewport-fit=cover, maximum-scale=1.0, user-scalable=no',
      meta: [
        { name: 'theme-color', content: '#007AFF' },
        { name: 'description', content: 'Game kuis interaktif untuk menguji pengetahuan kata baku dan tidak baku berdasarkan KBBI' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'mobile-web-app-capable', content: 'yes' }
      ],
      htmlAttrs: {
        lang: 'id'
      }
    }
  },

  nitro: {
    preset: 'static'
  }
})
