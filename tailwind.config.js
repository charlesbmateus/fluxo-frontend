/** @type {import('tailwindcss').Config} */
const COLORS = {
  PRIMARY: "#8B5CF6",
  SECONDARY_YELLOW: "oklch(0.80 0.15 85)",
  ACCENT: "#F59E0B",
};

module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      colors: {
        'primary-purple': COLORS.PRIMARY,
        'primary-yellow': '#FCD34D',
      }
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        light: {
          primary: COLORS.PRIMARY,
          secondary: COLORS.SECONDARY_YELLOW,
          accent: COLORS.ACCENT,
          neutral: "#3D4451",
          "base-100": "#FFFFFF",
          info: "#3ABFF8",
          success: "#36D399",
          warning: "#FBBD23",
          error: "#F87272",
        },
        dark: {
          primary: COLORS.PRIMARY,
          secondary: COLORS.SECONDARY_YELLOW,
          accent: COLORS.ACCENT,
          neutral: "#1F2937",
          "base-100": "#111827",
          info: "#3ABFF8",
          success: "#36D399",
          warning: "#FBBD23",
          error: "#F87272",
        },
      },
    ],
  },
}
