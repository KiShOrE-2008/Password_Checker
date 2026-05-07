/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00f0ff",
        secondary: "#8b929c",
        dark: "#0b0c10",
        panel: "rgba(31, 33, 42, 0.6)",
        veryWeak: "#ff4b4b",
        weak: "#ff8e3c",
        moderate: "#f8c630",
        strong: "#20e253",
        veryStrong: "#00f0ff",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
