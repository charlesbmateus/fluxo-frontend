# Fluxo Marketplace

A modern dashboard web application marketplace built with Nuxt 3, Vue 3, and DaisyUI.

## Features

### 🎨 Modern Dashboard
- Financial statistics and analytics
- Revenue charts with Chart.js
- Service management
- Real-time data visualization

### 🛍️ Marketplace
- Browse services with search and filters
- Clickable service cards with detailed information
- Rating and pricing display
- Service provider profiles

### 💬 Messaging System
- Modern chat interface inspired by italki
- Conversation list with timestamps
- Real-time messaging
- User-friendly message composition

### 🌍 Multi-Language Support
- English 🇬🇧
- German (Deutsch) 🇩🇪
- Italian (Italiano) 🇮🇹
- French (Français) 🇫🇷

### 🎨 Theming
- Purple (#8B5CF6) and Yellow (#FCD34D) color scheme
- Dark and Light mode support
- Smooth transitions and animations
- Responsive design for all devices

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

## Project Structure

```
app/
├── components/     # Reusable Vue components
├── composables/    # Vue composables (useApi, etc.)
├── layouts/        # Application layouts
├── locales/        # i18n translation files
├── pages/          # Application pages/routes
└── stores/         # Pinia stores for state management
```

## State Management with Pinia

The application uses Pinia for centralized state management. The following stores are available:

### Services Store (`app/stores/services.ts`)
- Manages services data from the marketplace
- Provides getters for filtering services by category
- Handles loading and error states

### Financial Store (`app/stores/financial.ts`)
- Manages financial data for the dashboard
- Provides revenue, orders, and services statistics
- Includes chart data for visualizations

### Messages Store (`app/stores/messages.ts`)
- Manages messaging functionality
- Tracks read/unread messages
- Provides message operations

### Auth Store (`app/stores/auth.ts`)
- Manages user authentication state
- Handles login, register, and logout operations
- Supports SSO authentication (Google, GitHub)

## API Integration

The application uses Pinia stores for state management and data fetching. To connect to the actual fluxo-backend:

1. Update the API endpoints in each store (e.g., `app/stores/services.ts`, `app/stores/auth.ts`)
2. Replace mock data with actual API calls to your backend
3. Configure environment variables in `.env` for your backend URL
4. Remove the simulated delays from the store actions

Example of updating a store:
```typescript
// In app/stores/services.ts
async fetchServices() {
  this.loading = true
  this.error = null
  
  try {
    const response = await $fetch('/api/services', {
      baseURL: useRuntimeConfig().public.apiBase
    })
    this.services = response.data
  } catch (err) {
    this.error = 'Failed to fetch services'
  } finally {
    this.loading = false
  }
}
```

## Technologies

- **Nuxt 3** - Vue.js framework
- **Vue 3** - Progressive JavaScript framework
- **Pinia** - State management for Vue
- **DaisyUI** - Tailwind CSS component library
- **Chart.js** - Data visualization
- **@nuxtjs/i18n** - Internationalization
- **@nuxtjs/color-mode** - Dark mode support
- **TypeScript** - Type safety

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

