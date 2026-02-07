<!-- components/navbar/Navbar.vue -->
<template>
  <div class="navbar bg-base-100 shadow-md">
    <div class="container mx-auto flex w-full items-center">

      <!-- Left -->
      <div class="flex items-center gap-2">
        <NavbarBrand />
      </div>

      <!-- Right -->
      <div class="ml-auto flex items-center gap-2">
        <slot name="actions" />
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import NavbarBrand from './NavbarBrand.vue'
</script>