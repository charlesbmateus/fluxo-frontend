// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  build: {
    transpile: ['vue-echarts', 'echarts', 'zrender', 'tslib', 'resize-detector']
  },

  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:8000/api',
    },
  },
  
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
    '@nuxtjs/color-mode'
  ],

  colorMode: {
    preference: 'system',
    fallback: 'light',
    dataValue: 'theme',
    classSuffix: ''
  },

  i18n: {
    vueI18n: './i18n.config.ts',
    locales: [
      { code: 'en', language: 'en-US', name:'English', file: 'en.json' },
      { code: 'de', language: 'de-DE', name:'Deutsch', file: 'de.json' },
      { code: 'it', language: 'it-IT', name:'Italiano', file: 'it.json' },
      { code: 'fr', language: 'fr-FR', name:'Français', file: 'fr.json' }
    ],
    defaultLocale: 'en',
    strategy: 'no_prefix',
    langDir: 'locales'
  },

  app: {
    head: {
      title: 'Fluxo Marketplace',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Modern dashboard marketplace for services' }
      ]
    }
  }
})
