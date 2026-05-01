import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: "#10151f",
        cloud: "#f6f7fb",
        signal: "#2f7df4",
        mint: "#12b981",
        coral: "#f46f52",
      },
      boxShadow: {
        soft: "0 18px 60px rgba(17, 24, 39, 0.12)",
      },
    },
  },
  plugins: [],
} satisfies Config;
