<template>
  <div class="min-h-screen">
    <!-- Simplified Navbar for Home Page -->
    <div class="navbar bg-base-100 shadow-md">
      <div class="container mx-auto">
        <div class="flex-1">
          <NuxtLink to="/" class="btn btn-ghost text-xl">
            <span class="text-primary">Fluxo</span>
            <span class="text-secondary">Marketplace</span>
          </NuxtLink>
        </div>
        <div class="flex-none gap-2">
          <NuxtLink to="/marketplace" class="btn btn-ghost">
            {{ $t('nav.marketplace') }}
          </NuxtLink>
          <NuxtLink to="/dashboard" class="btn btn-ghost">
            {{ $t('nav.dashboard') }}
          </NuxtLink>
          
          <!-- Language Selector -->
          <div class="dropdown dropdown-end">
            <label tabindex="0" class="btn btn-ghost btn-circle">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
              </svg>
            </label>
            <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-32">
              <li v-for="locale in availableLocales" :key="locale.code">
                <a @click="setLocale(locale.code)">{{ locale.name }}</a>
              </li>
            </ul>
          </div>

          <!-- Theme Toggle -->
          <label class="swap swap-rotate btn btn-ghost btn-circle">
            <input type="checkbox" @change="toggleTheme" :checked="colorMode.preference === 'dark'" />
            <svg class="swap-on fill-current w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/>
            </svg>
            <svg class="swap-off fill-current w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/>
            </svg>
          </label>

          <NuxtLink to="/login" class="btn btn-ghost btn-sm">
            {{ $t('auth.login') }}
          </NuxtLink>
          <NuxtLink to="/register" class="btn btn-primary btn-sm">
            {{ $t('auth.register') }}
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Hero Section -->
    <section class="hero min-h-[600px] bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10">
      <div class="hero-content text-center max-w-6xl px-4">
        <div>
          <h1 class="text-5xl md:text-6xl font-bold mb-6">
            {{ $t('home.hero.title') }}
            <span class="text-primary">{{ $t('home.hero.titleHighlight') }}</span>
          </h1>
          <p class="text-xl md:text-2xl text-base-content/70 mb-8 max-w-3xl mx-auto">
            {{ $t('home.hero.subtitle') }}
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink to="/marketplace" class="btn btn-primary btn-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
              </svg>
              {{ $t('home.hero.browseServices') }}
            </NuxtLink>
            <NuxtLink to="/register" class="btn btn-outline btn-lg">
              {{ $t('home.hero.getStarted') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-16 bg-base-200">
      <div class="container mx-auto px-4">
        <div class="stats stats-vertical lg:stats-horizontal shadow w-full">
          <div class="stat place-items-center">
            <div class="stat-title">{{ $t('home.stats.services') }}</div>
            <div class="stat-value text-primary">10K+</div>
            <div class="stat-desc">{{ $t('home.stats.servicesDesc') }}</div>
          </div>
          <div class="stat place-items-center">
            <div class="stat-title">{{ $t('home.stats.providers') }}</div>
            <div class="stat-value text-secondary">5K+</div>
            <div class="stat-desc">{{ $t('home.stats.providersDesc') }}</div>
          </div>
          <div class="stat place-items-center">
            <div class="stat-title">{{ $t('home.stats.transactions') }}</div>
            <div class="stat-value">50K+</div>
            <div class="stat-desc">{{ $t('home.stats.transactionsDesc') }}</div>
          </div>
          <div class="stat place-items-center">
            <div class="stat-title">{{ $t('home.stats.satisfaction') }}</div>
            <div class="stat-value text-success">98%</div>
            <div class="stat-desc">{{ $t('home.stats.satisfactionDesc') }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="py-20 bg-base-100">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold mb-4">{{ $t('home.categories.title') }}</h2>
          <p class="text-xl text-base-content/70">{{ $t('home.categories.subtitle') }}</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="category in categories" 
            :key="category.name"
            class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all cursor-pointer border border-base-300"
            @click="goToCategory(category.slug)"
          >
            <div class="card-body items-center text-center">
              <div class="mb-4" v-html="category.icon"></div>
              <h3 class="card-title">{{ $t(category.name) }}</h3>
              <p class="text-base-content/70">{{ $t(category.description) }}</p>
              <div class="badge badge-outline mt-2">{{ category.count }} {{ $t('home.categories.services') }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Services Section -->
    <section class="py-20 bg-base-200">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold mb-4">{{ $t('home.featured.title') }}</h2>
          <p class="text-xl text-base-content/70">{{ $t('home.featured.subtitle') }}</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <template v-if="loading">
            <SkeletonsServiceCardSkeleton v-for="i in 3" :key="i" />
          </template>
          <template v-else>
            <div 
              v-for="service in featuredServices" 
              :key="service.id"
              class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all cursor-pointer"
              @click="goToService(service.id)"
            >
              <figure class="h-48">
                <img :src="service.image" :alt="service.name" class="w-full h-full object-cover" />
              </figure>
              <div class="card-body">
                <div class="flex justify-between items-start">
                  <h3 class="card-title">{{ service.name }}</h3>
                  <div class="badge badge-primary badge-outline">{{ service.category }}</div>
                </div>
                <p class="text-base-content/70">{{ service.description }}</p>
                <div class="flex items-center gap-2 mt-2">
                  <div class="avatar placeholder">
                    <div class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs">
                      {{ service.provider.charAt(0) }}
                    </div>
                  </div>
                  <span class="text-sm text-base-content/70">{{ service.provider }}</span>
                </div>
                <div class="card-actions justify-between items-center mt-4">
                  <div class="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-secondary">
                      <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
                    </svg>
                    <span class="font-semibold">{{ service.rating }}</span>
                  </div>
                  <div class="text-xl font-bold text-primary">${{ service.price }}</div>
                </div>
              </div>
            </div>
          </template>
        </div>
        <div class="text-center mt-8">
          <NuxtLink to="/marketplace" class="btn btn-primary">
            {{ $t('home.featured.viewAll') }}
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="py-20 bg-base-100">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold mb-4">{{ $t('home.howItWorks.title') }}</h2>
          <p class="text-xl text-base-content/70">{{ $t('home.howItWorks.subtitle') }}</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="mb-4 flex justify-center">
              <div class="avatar placeholder">
                <div class="bg-primary text-primary-content rounded-full w-20">
                  <span class="text-3xl">1</span>
                </div>
              </div>
            </div>
            <h3 class="text-2xl font-bold mb-3">{{ $t('home.howItWorks.step1Title') }}</h3>
            <p class="text-base-content/70">{{ $t('home.howItWorks.step1Desc') }}</p>
          </div>
          <div class="text-center">
            <div class="mb-4 flex justify-center">
              <div class="avatar placeholder">
                <div class="bg-secondary text-secondary-content rounded-full w-20">
                  <span class="text-3xl">2</span>
                </div>
              </div>
            </div>
            <h3 class="text-2xl font-bold mb-3">{{ $t('home.howItWorks.step2Title') }}</h3>
            <p class="text-base-content/70">{{ $t('home.howItWorks.step2Desc') }}</p>
          </div>
          <div class="text-center">
            <div class="mb-4 flex justify-center">
              <div class="avatar placeholder">
                <div class="bg-accent text-accent-content rounded-full w-20">
                  <span class="text-3xl">3</span>
                </div>
              </div>
            </div>
            <h3 class="text-2xl font-bold mb-3">{{ $t('home.howItWorks.step3Title') }}</h3>
            <p class="text-base-content/70">{{ $t('home.howItWorks.step3Desc') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-r from-primary to-secondary">
      <div class="container mx-auto px-4">
        <div class="text-center text-white">
          <h2 class="text-4xl font-bold mb-4">{{ $t('home.cta.title') }}</h2>
          <p class="text-xl mb-8 opacity-90">{{ $t('home.cta.subtitle') }}</p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink to="/register" class="btn btn-lg bg-white text-primary hover:bg-base-200">
              {{ $t('home.cta.joinNow') }}
            </NuxtLink>
            <NuxtLink to="/marketplace" class="btn btn-lg btn-outline border-white text-white hover:bg-white hover:text-primary">
              {{ $t('home.cta.learnMore') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer p-10 bg-base-200 text-base-content">
      <div class="container mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <span class="footer-title">{{ $t('home.footer.about') }}</span>
            <p class="text-base-content/70">{{ $t('home.footer.aboutDesc') }}</p>
          </div>
          <div>
            <span class="footer-title">{{ $t('home.footer.services') }}</span>
            <a class="link link-hover">{{ $t('home.footer.development') }}</a>
            <a class="link link-hover">{{ $t('home.footer.design') }}</a>
            <a class="link link-hover">{{ $t('home.footer.marketing') }}</a>
            <a class="link link-hover">{{ $t('home.footer.writing') }}</a>
          </div>
          <div>
            <span class="footer-title">{{ $t('home.footer.company') }}</span>
            <a class="link link-hover">{{ $t('home.footer.aboutUs') }}</a>
            <a class="link link-hover">{{ $t('home.footer.contact') }}</a>
            <a class="link link-hover">{{ $t('home.footer.careers') }}</a>
            <a class="link link-hover">{{ $t('home.footer.blog') }}</a>
          </div>
          <div>
            <span class="footer-title">{{ $t('home.footer.legal') }}</span>
            <a class="link link-hover">{{ $t('home.footer.terms') }}</a>
            <a class="link link-hover">{{ $t('home.footer.privacy') }}</a>
            <a class="link link-hover">{{ $t('home.footer.cookies') }}</a>
          </div>
        </div>
      </div>
    </footer>
    <footer class="footer footer-center p-4 bg-base-300 text-base-content">
      <div>
        <p>© 2026 Fluxo Marketplace. {{ $t('home.footer.copyright') }}</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import type { Service } from '~/types'

const { locale, locales, setLocale } = useI18n()
const colorMode = useColorMode()
const { fetchServices } = useApi()
const router = useRouter()

const featuredServices = ref<Service[]>([])
const loading = ref(true)

const availableLocales = computed(() => {
  return locales.value
})

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const categories = [
  {
    name: 'home.categories.development',
    description: 'home.categories.developmentDesc',
    slug: 'development',
    count: 2500,
    icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 text-primary"><path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>'
  },
  {
    name: 'home.categories.design',
    description: 'home.categories.designDesc',
    slug: 'design',
    count: 1800,
    icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 text-secondary"><path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" /></svg>'
  },
  {
    name: 'home.categories.writing',
    description: 'home.categories.writingDesc',
    slug: 'writing',
    count: 1200,
    icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 text-accent"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>'
  },
  {
    name: 'home.categories.marketing',
    description: 'home.categories.marketingDesc',
    slug: 'marketing',
    count: 1500,
    icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 text-info"><path stroke-linecap="round" stroke-linejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" /></svg>'
  },
  {
    name: 'home.categories.video',
    description: 'home.categories.videoDesc',
    slug: 'video',
    count: 900,
    icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 text-success"><path stroke-linecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" /></svg>'
  },
  {
    name: 'home.categories.business',
    description: 'home.categories.businessDesc',
    slug: 'business',
    count: 1100,
    icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 text-warning"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" /></svg>'
  }
]

const goToCategory = (slug: string) => {
  router.push(`/marketplace?category=${slug}`)
}

const goToService = (id: number) => {
  router.push(`/service/${id}`)
}

onMounted(async () => {
  loading.value = true
  try {
    const data = await fetchServices()
    featuredServices.value = data.data.slice(0, 3)
  } finally {
    loading.value = false
  }
})

// Set layout to none for home page (we'll use a simpler navbar)
definePageMeta({
  layout: false
})
</script>
