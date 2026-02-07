<!-- components/navbar/MessagesMenu.vue -->
<template>
  <div class="dropdown dropdown-end">
    <label tabindex="0" class="btn btn-ghost btn-circle">
      <div class="indicator">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
             stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0
            A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25" />
        </svg>
        <span class="badge badge-xs badge-primary indicator-item">5</span>
      </div>
    </label>

    <ul tabindex="0"
        class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-80">
      <li class="menu-title">
        <span>Messages</span>
      </li>

      <li>
        <a class="flex items-center gap-3">
          <div class="avatar placeholder">
            <div class="bg-neutral text-neutral-content rounded-full w-8">
              <span class="text-xs">JD</span>
            </div>
          </div>
          <div class="flex flex-col">
            <span class="font-semibold">John Doe</span>
            <span class="text-xs opacity-50">Hi, I'm interested in your...</span>
          </div>
        </a>
      </li>

      <li class="mt-2">
        <NuxtLink to="/messages" class="btn btn-sm btn-block">
          View All Messages
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>