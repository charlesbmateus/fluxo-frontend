// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  modules: [
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
    locales: ['en', 'de', 'it', 'fr'],
    defaultLocale: 'en',
  },

  app: {
    head: {
      title: 'Fluxo',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Modern dashboard for services' }
      ]
    }
  },

  runtimeConfig: {
    public: {
      auth0Domain: process.env.NUXT_PUBLIC_AUTH0_DOMAIN || '',
      auth0ClientId: process.env.NUXT_PUBLIC_AUTH0_CLIENT_ID || ''
    }
  }
})
