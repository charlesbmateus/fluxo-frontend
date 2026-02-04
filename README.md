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
└── pages/          # Application pages/routes
```

## API Integration

The application uses mock data for demonstration. To connect to the actual backend:

1. Update the `baseURL` in `app/composables/useApi.ts`
2. Replace mock functions with actual API calls
3. Configure environment variables in `.env`

## Technologies

- **Nuxt 3** - Vue.js framework
- **Vue 3** - Progressive JavaScript framework
- **DaisyUI** - Tailwind CSS component library
- **Chart.js** - Data visualization
- **@nuxtjs/i18n** - Internationalization
- **@nuxtjs/color-mode** - Dark mode support
- **TypeScript** - Type safety

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

