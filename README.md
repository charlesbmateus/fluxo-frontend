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
├── layouts/        # Application layouts
├── locales/        # i18n translation files
├── middleware/     # Route guards and middleware
├── pages/          # Application pages/routes
└── types/          # TypeScript type definitions
stores/             # Pinia state management
├── auth.ts         # Authentication store
└── api.ts          # API data store
```

## State Management

The application uses **Pinia v3** for centralized state management:

- **Authentication Store** (`stores/auth.ts`)
  - User authentication and session management
  - Login, register, and SSO (Google/GitHub) support
  - Logout functionality

- **API Store** (`stores/api.ts`)
  - Services data management
  - Financial data and analytics
  - Messages and notifications
  - Loading states for each data type

For detailed information about Pinia integration and backend setup, see [PINIA_INTEGRATION.md](./PINIA_INTEGRATION.md).

## API Integration

The application uses Pinia stores with mock data for demonstration. To connect to the actual fluxo-backend:

1. Set the backend API URL in environment variables:
   ```bash
   NUXT_PUBLIC_API_BASE=https://api.fluxo.example.com
   ```

2. Replace mock data in stores with actual API calls:
   - See `TODO` comments in `stores/auth.ts` and `stores/api.ts`
   - Use Nuxt's `$fetch` utility for API calls

3. Refer to [PINIA_INTEGRATION.md](./PINIA_INTEGRATION.md) for detailed integration guide

## Technologies

- **Nuxt 4** - Vue.js framework with improved DX
- **Vue 3** - Progressive JavaScript framework
- **Pinia 3** - Official Vue state management
- **DaisyUI** - Tailwind CSS component library
- **Chart.js** - Data visualization
- **@nuxtjs/i18n** - Internationalization
- **@nuxtjs/color-mode** - Dark mode support
- **TypeScript** - Type safety

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

