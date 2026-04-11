/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6B7280',
        'bg-light': '#F5F5F5',
        'bg-lighter': '#E0E0E0',
        'text-dark': '#111827',
      },
      borderRadius: {
        'soft': '8px',
        'softer': '12px',
      },
      boxShadow: {
        'soft': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'softer': '0 2px 8px rgba(0, 0, 0, 0.08)',
      }
    },
  },
  plugins: [],
}
