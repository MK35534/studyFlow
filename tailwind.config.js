/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Active le dark mode via la classe 'dark' sur <html>
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
