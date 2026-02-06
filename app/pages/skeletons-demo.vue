<template>
  <NuxtLayout name="default">
    <div class="space-y-6">
      <!-- Header -->
      <div>
        <h1 class="text-3xl font-bold">Skeleton Loaders Demo</h1>
        <p class="text-base-content/60 mt-1">Preview of all skeleton loading states</p>
      </div>

      <!-- Stats Cards Section -->
      <div>
        <h2 class="text-2xl font-bold mb-4">Stat Card Skeletons</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SkeletonsStatCardSkeleton v-for="i in 4" :key="i" />
        </div>
      </div>

      <!-- Service Cards Section -->
      <div>
        <h2 class="text-2xl font-bold mb-4">Service Card Skeletons</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonsServiceCardSkeleton v-for="i in 3" :key="i" />
        </div>
      </div>

      <!-- Chart and Service List Section -->
      <div>
        <h2 class="text-2xl font-bold mb-4">Chart and Service Item Skeletons</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SkeletonsChartSkeleton />
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <div class="skeleton h-6 w-40 mb-4"></div>
              <div class="space-y-3">
                <SkeletonsServiceItemSkeleton v-for="i in 3" :key="i" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Basic Skeleton Components -->
      <div>
        <h2 class="text-2xl font-bold mb-4">Basic Skeleton Components</h2>
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body space-y-4">
            <div>
              <h3 class="text-lg font-semibold mb-2">Text Skeletons</h3>
              <div class="space-y-2">
                <div class="skeleton h-4 w-full"></div>
                <div class="skeleton h-4 w-5/6"></div>
                <div class="skeleton h-4 w-4/6"></div>
              </div>
            </div>
            <div>
              <h3 class="text-lg font-semibold mb-2">Circle Skeletons</h3>
              <div class="flex gap-4">
                <div class="skeleton w-12 h-12 rounded-full"></div>
                <div class="skeleton w-16 h-16 rounded-full"></div>
                <div class="skeleton w-20 h-20 rounded-full"></div>
              </div>
            </div>
            <div>
              <h3 class="text-lg font-semibold mb-2">Rectangle Skeletons</h3>
              <div class="space-y-2">
                <div class="skeleton h-32 w-full"></div>
                <div class="skeleton h-4 w-28"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
</script>
