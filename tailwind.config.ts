import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eafaf4",
          100: "#d2f5e5",
          200: "#a9ebcb",
          300: "#7ce0b0",
          400: "#45d08d",
          500: "#1bbd6a",
          600: "#109d56",
          700: "#0d7d47",
          800: "#0d5f39",
          900: "#0d4b2f",
        },
        deep: {
          950: "#06131d",
          900: "#0c1d2a",
        },
      },
      boxShadow: {
        soft: "0 20px 45px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
