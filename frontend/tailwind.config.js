/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2E3791',
          50: '#e8eaf7',
          100: '#c4c9eb',
          200: '#9ca5de',
          300: '#7481d1',
          400: '#5767c7',
          500: '#2E3791', // Color principal
          600: '#283180',
          700: '#1e2563',
          800: '#161b4a',
          900: '#0d1131',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'Open Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
