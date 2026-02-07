# Pinia v3 Integration Guide

## Overview
This document describes the Pinia v3 implementation in Fluxo Frontend and provides guidance for integrating with the fluxo-backend API.

## Architecture

### Stores Structure
```
stores/
├── auth.ts      # Authentication state management
└── api.ts       # API data (services, financial data, messages)
```

## Authentication Store (`stores/auth.ts`)

### State
- `user`: User object (id, name, email, avatar, provider) or null

### Getters
- `isAuthenticated`: Boolean indicating if user is logged in
- `currentUser`: Returns the current user object

### Actions
- `login(email, password)`: Email/password authentication
- `register(name, email, password)`: User registration
- `loginWithGoogle()`: Google OAuth authentication
- `loginWithGithub()`: GitHub OAuth authentication
- `logout()`: Clear user session

### Backend Integration Points
Each action has a TODO comment indicating where to add the actual API call. Example:

```typescript
// TODO: Replace with actual API call to fluxo-backend authentication endpoint
// Example: const response = await $fetch('/api/auth/login', { 
//   method: 'POST', 
//   body: { email, password },
//   baseURL: config.public.apiBase 
// })
```

## API Store (`stores/api.ts`)

### State
- `services`: Array of service objects
- `financialData`: Financial metrics and chart data
- `messages`: Array of message objects
- `loading`: Object tracking loading states for each data type

### Getters
- `getServiceById(id)`: Find a service by its ID
- `unreadMessagesCount`: Count of unread messages

### Actions
- `fetchServices()`: Retrieve all services
- `fetchFinancialData()`: Get financial metrics and analytics
- `fetchMessages()`: Load user messages

### Backend Integration Points
Each fetch action includes TODO comments for API integration:

```typescript
// TODO: Replace with actual API call to fluxo-backend
// Example: const response = await $fetch('/api/services', { 
//   baseURL: config.public.apiBase 
// })
```

## Configuration

### Nuxt Config
Pinia is configured in `nuxt.config.ts`:

```typescript
modules: [
  '@nuxtjs/tailwindcss',
  '@nuxtjs/i18n',
  '@nuxtjs/color-mode',
  '@pinia/nuxt'  // ← Pinia module
]
```

### API Base URL
Configure the backend URL in `nuxt.config.ts`:

```typescript
runtimeConfig: {
  public: {
    apiBase: process.env.NUXT_PUBLIC_API_BASE || 'https://api.fluxo.example.com'
  }
}
```

Then access it in stores using:
```typescript
const config = useRuntimeConfig()
const baseURL = config.public.apiBase
```

## Usage in Components

### Authentication
```vue
<script setup>
const authStore = useAuthStore()

// Access state
const user = computed(() => authStore.currentUser)
const isAuth = computed(() => authStore.isAuthenticated)

// Call actions
const handleLogin = async () => {
  const result = await authStore.login(email.value, password.value)
  if (result.success) {
    // Handle success
  }
}
</script>
```

### API Data
```vue
<script setup>
const apiStore = useApiStore()

// Access state
const services = computed(() => apiStore.services)
const loading = computed(() => apiStore.loading.services)

// Fetch data
onMounted(async () => {
  await apiStore.fetchServices()
})
</script>
```

## Backend Integration Steps

1. **Set up environment variables**
   ```bash
   NUXT_PUBLIC_API_BASE=https://api.fluxo.example.com
   ```

2. **Replace mock data in stores**
   - Search for `TODO:` comments in `stores/auth.ts` and `stores/api.ts`
   - Replace mock implementations with actual API calls using `$fetch`

3. **Handle errors and responses**
   ```typescript
   try {
     const response = await $fetch('/api/endpoint', {
       method: 'POST',
       body: data,
       baseURL: config.public.apiBase
     })
     // Handle success
   } catch (error) {
     // Handle error
     console.error('API error:', error)
   }
   ```

4. **Add authentication headers** (if needed)
   ```typescript
   const response = await $fetch('/api/endpoint', {
     headers: {
       'Authorization': `Bearer ${token}`
     },
     baseURL: config.public.apiBase
   })
   ```

5. **Test each endpoint incrementally**
   - Start with authentication endpoints
   - Then add data fetching endpoints
   - Test error handling

## Testing

### Build
```bash
npm run build
```

### Development
```bash
npm run dev
```

### Preview Production Build
```bash
npm run preview
```

## Benefits of Pinia Implementation

✅ **Centralized State**: All application state in one place  
✅ **Type Safety**: Full TypeScript support  
✅ **Devtools**: Vue Devtools integration for debugging  
✅ **SSR Compatible**: Works with Nuxt server-side rendering  
✅ **Modular**: Easy to add new stores as app grows  
✅ **Performance**: Optimized reactivity and computed values  

## Security Considerations

- ✅ No vulnerabilities in Pinia dependencies (v3.0.4)
- Store sensitive tokens securely (use httpOnly cookies)
- Validate API responses before storing in state
- Implement proper error handling for all API calls
- Add request/response interceptors for authentication
