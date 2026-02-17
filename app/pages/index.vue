<script lang="ts" setup>
import type {Service} from '~/types'

const { fetchServices } = useApi()
const router = useRouter()

const featuredServices = ref<Service[]>([])
const loading = ref(true)

const categories = [
  {
    name: 'home.categories.development',
    description: 'home.categories.developmentDesc',
    slug: 'development',
    count: 2500,
    icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>'
  },
  {
    name: 'home.categories.design',
    description: 'home.categories.designDesc',
    slug: 'design',
    count: 1800,
    icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>'
  },
  {
    name: 'home.categories.writing',
    description: 'home.categories.writingDesc',
    slug: 'writing',
    count: 1200,
    icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>'
  },
  {
    name: 'home.categories.marketing',
    description: 'home.categories.marketingDesc',
    slug: 'marketing',
    count: 1500,
    icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>'
  },
  {
    name: 'home.categories.video',
    description: 'home.categories.videoDesc',
    slug: 'video',
    count: 900,
    icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>'
  },
  {
    name: 'home.categories.business',
    description: 'home.categories.businessDesc',
    slug: 'business',
    count: 1100,
    icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>'
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
    featuredServices.value = data.slice(0, 3)
  } finally {
    loading.value = false
  }
})

// Set layout to none for home page (we'll use a simpler navbar)
definePageMeta({
  layout: false
})
</script>

<template>
  <div class="min-h-screen">
    <!-- Navbar -->
    <Navbar />

    <!-- Hero Section -->
    <section
        class="hero min-h-[600px] bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10"
        style="background-image: url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp);"
    >
      <div class="hero-overlay"></div>
      <div class="hero-content text-center max-w-6xl px-4">
        <div>
          <h1 class="text-3xl md:text-5xl font-normal mb-6 leading-tight flex flex-col items-center text-white">
            <span class="text-rotate duration-6000 whitespace-break-spaces leading-[1.5]">
              <span class="justify-items-center">
                <span>{{ $t('home.hero.title1') }}</span>
                <span>{{ $t('home.hero.title2') }}</span>
                <span>{{ $t('home.hero.title3') }}</span>
                <span>{{ $t('home.hero.title4') }}</span>
              </span>
            </span>
            <span class="text-primary mt-2">{{ $t('home.hero.titleHighlight') }}</span>
          </h1>
          <p class="text-xl md:text-2xl text-base-content/70 mb-8 max-w-3xl mx-auto text-white">
            {{ $t('home.hero.subtitle') }}
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center text-white">
            <NuxtLink class="btn btn-primary btn-lg text-white" to="/marketplace">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              {{ $t('home.hero.browseServices') }}
            </NuxtLink>
            <NuxtLink class="btn btn-outline btn-lg bg-transparent" to="/register">
              {{ $t('home.hero.getStarted') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="py-20 bg-base-200">
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
    <section class="py-20 bg-base-100">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold mb-4">{{ $t('home.featured.title') }}</h2>
          <p class="text-xl text-base-content/70">{{ $t('home.featured.subtitle') }}</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <template v-if="loading">
            <SkeletonsServiceCardSkeleton v-for="i in 3" :key="i"/>
          </template>
          <template v-else>
            <div
                v-for="service in featuredServices"
                :key="service.id"
                class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all cursor-pointer"
                @click="goToService(service.id)"
            >
              <figure class="h-48">
                <img :alt="service.name" :src="service.image" class="w-full h-full object-cover"/>
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
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-secondary" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    <span class="font-semibold">{{ service.rating }}</span>
                  </div>
                  <div class="text-xl font-bold text-primary">${{ service.price }}</div>
                </div>
              </div>
            </div>
          </template>
        </div>
        <div class="text-center mt-8">
          <NuxtLink class="btn btn-primary text-white" to="/marketplace">
            {{ $t('home.featured.viewAll') }}
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="py-20 bg-base-200">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold mb-4">{{ $t('home.howItWorks.title') }}</h2>
          <p class="text-xl text-base-content/70">{{ $t('home.howItWorks.subtitle') }}</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="mb-4 flex justify-center">
              <div class="avatar placeholder">
                <div class="bg-primary text-primary-content rounded-full w-20 flex justify-center place-items-center">
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
                <div
                    class="bg-secondary text-secondary-content rounded-full w-20 flex justify-center place-items-center">
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
                <div class="bg-accent text-accent-content rounded-full w-20 flex justify-center place-items-center">
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
    <section class="py-20 bg-gradient-to-r from-purple-600 to-yellow-500">
      <div class="container mx-auto px-4">
        <div class="text-center text-white">
          <h2 class="text-4xl font-bold mb-4">{{ $t('home.cta.title') }}</h2>
          <p class="text-xl mb-8 opacity-90">{{ $t('home.cta.subtitle') }}</p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink class="btn btn-lg bg-white text-primary hover:bg-base-200" to="/register">
              {{ $t('home.cta.joinNow') }}
            </NuxtLink>
            <NuxtLink class="btn btn-lg btn-outline border-white text-white hover:bg-white hover:text-primary"
                      to="/marketplace">
              {{ $t('home.cta.learnMore') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer sm:footer-horizontal bg-base-100 text-base-content p-10">
      <nav>
        <h6 class="footer-title">{{ $t('home.footer.about') }}</h6>
        <p class="text-base-content/70 max-w-xs">{{ $t('home.footer.aboutDesc') }}</p>
      </nav>
      <nav>
        <h6 class="footer-title">{{ $t('home.footer.services') }}</h6>
        <a class="link link-hover">{{ $t('home.footer.development') }}</a>
        <a class="link link-hover">{{ $t('home.footer.design') }}</a>
        <a class="link link-hover">{{ $t('home.footer.marketing') }}</a>
        <a class="link link-hover">{{ $t('home.footer.writing') }}</a>
      </nav>
      <nav>
        <h6 class="footer-title">{{ $t('home.footer.company') }}</h6>
        <a class="link link-hover">{{ $t('home.footer.aboutUs') }}</a>
        <a class="link link-hover">{{ $t('home.footer.contact') }}</a>
        <a class="link link-hover">{{ $t('home.footer.careers') }}</a>
        <a class="link link-hover">{{ $t('home.footer.blog') }}</a>
      </nav>
      <nav>
        <h6 class="footer-title">{{ $t('home.footer.legal') }}</h6>
        <a class="link link-hover">{{ $t('home.footer.terms') }}</a>
        <a class="link link-hover">{{ $t('home.footer.privacy') }}</a>
        <a class="link link-hover">{{ $t('home.footer.cookies') }}</a>
      </nav>
    </footer>
    <footer class="footer footer-center p-4 bg-base-100 text-base-content">
      <div>
        <p>© 2026 Fluxo Marketplace. {{ $t('home.footer.copyright') }}</p>
      </div>
    </footer>
  </div>
</template>