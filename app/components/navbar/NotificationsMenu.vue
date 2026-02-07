<!-- components/navbar/NotificationsMenu.vue -->
<template>
  <div class="dropdown dropdown-end">
    <label tabindex="0" class="btn btn-ghost btn-circle">
      <div class="indicator">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
          stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
        <span class="badge badge-xs badge-primary indicator-item">3</span>
      </div>
    </label>

    <ul tabindex="0"
      class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-80">
      <li class="menu-title">
        <span>Notifications</span>
      </li>

      <li>
        <a class="flex flex-col items-start">
          <span class="font-semibold">New service request</span>
          <span class="text-xs opacity-50">John Doe requested your service</span>
        </a>
      </li>

      <li class="mt-2">
        <button class="btn btn-sm btn-block">View All</button>
      </li>
    </ul>
  </div>
</template>