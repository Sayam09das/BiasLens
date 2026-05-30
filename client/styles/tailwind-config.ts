export const tailwindTheme = {
  colors: {
    background: "var(--background)",
    backgroundSecondary: "var(--background-secondary)",
    backgroundTertiary: "var(--background-tertiary)",
    foreground: "var(--foreground)",
    foregroundSecondary: "var(--foreground-secondary)",
    foregroundMuted: "var(--foreground-muted)",
    primary: "var(--primary)",
    primaryHover: "var(--primary-hover)",
    primarySoft: "var(--primary-soft)",
    border: "var(--border)",
    borderStrong: "var(--border-strong)",
    success: "var(--success)",
    warning: "var(--warning)",
    danger: "var(--danger)",
  },
  boxShadow: {
    soft: "var(--shadow-soft)",
  },
  fontFamily: {
    sans: ["var(--font-mona-sans)", "sans-serif"],
    mono: [
      "SFMono-Regular",
      "SF Mono",
      "Consolas",
      "Liberation Mono",
      "Menlo",
      "monospace",
    ],
  },
} as const;

export const tailwindContent = [
  "./app/**/*.{ts,tsx}",
  "./components/**/*.{ts,tsx}",
  "./features/**/*.{ts,tsx}",
  "./lib/**/*.{ts,tsx}",
] as const;
