import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./providers/**/*.{ts,tsx}",
    "./store/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "var(--border)",
        foreground: "var(--foreground)",
        "foreground-muted": "var(--foreground-muted)",
        primary: "var(--primary)",
        danger: "var(--danger)",
      },
      fontFamily: {
        sans: ["var(--font-mona-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        dashboard: "0 24px 64px rgba(13, 12, 34, 0.08)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
};

export default config;
