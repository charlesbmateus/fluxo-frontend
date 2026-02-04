/** @type {import('tailwindcss').Config} */
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
        'primary-purple': '#8B5CF6',
        'primary-yellow': '#FCD34D',
      }
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        light: {
          primary: "#8B5CF6",
          secondary: "#FCD34D",
          accent: "#F59E0B",
          neutral: "#3D4451",
          "base-100": "#FFFFFF",
          info: "#3ABFF8",
          success: "#36D399",
          warning: "#FBBD23",
          error: "#F87272",
        },
        dark: {
          primary: "#8B5CF6",
          secondary: "#FCD34D",
          accent: "#F59E0B",
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
