/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      boxShadow: {
        soft: "0 24px 60px -34px rgba(2, 6, 23, 0.72)",
        glow: "0 24px 70px -40px rgba(56, 189, 248, 0.5)",
      },
      colors: {
        brand: {
          400: "#7dd3fc",
          500: "#38bdf8",
          600: "#0284c7",
        },
      },
    },
  },
  plugins: [],
};
