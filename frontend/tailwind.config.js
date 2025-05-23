/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E293B', // navy gelap
        secondary: '#334155', // abu gelap
        accent: '#3B82F6', // biru terang
        background: '#F9FAFB', // latar konten
        text: '#111827', // teks
      },
    },
  },
  plugins: [],
}
