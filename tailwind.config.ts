import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Official PingME (plzpingme.com) Brand Palette
        brand: {
          primary: "#EE9C18",   // Official PingME golden yellow
          secondary: "#F3A82B", // PingME secondary warm gold
          dark: "#D6880D",      // Rich amber/gold hover
          navy: "#1C1917",      // Deep warm graphite/charcoal
          bg: "#FEF9EC",        // Official PingME light warm cream background
          tint: "#FDF2D6",      // Warm yellow container tint
          border: "#EADFC7",    // Warm hairline border
        },
        fresh: {
          green: "#20A464",     // Fresh green (safe, verified)
          mint: "#E8F7EF",      // Soft mint
        },
        emergency: {
          red: "#E5484D",       // Emergency red (108, critical distress)
          50: "#FEF2F2",
          100: "#FEE2E2",
          500: "#E5484D",
          600: "#D32F2F",
          700: "#B71C1C",
        },
        warning: {
          amber: "#EE9C18",     // PingME yellow-amber
          50: "#FEF9EC",
          100: "#FDF2D6",
          500: "#EE9C18",
          600: "#D6880D",
        },
        text: {
          main: "#1C1917",      // Deep readable charcoal
          secondary: "#78716C", // Warm slate-stone secondary
        },
        surface: {
          white: "#FFFFFF",
          card: "#FFFFFF",
          border: "#EADFC7",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "Plus Jakarta Sans",
          "Manrope",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(28, 25, 23, 0.05), 0 1px 2px 0 rgba(28, 25, 23, 0.03)",
        card: "0 4px 16px -2px rgba(28, 25, 23, 0.06), 0 2px 6px -1px rgba(28, 25, 23, 0.03)",
        elevated: "0 10px 30px -4px rgba(28, 25, 23, 0.09), 0 4px 10px -2px rgba(28, 25, 23, 0.04)",
        emergency: "0 8px 24px -4px rgba(229, 72, 77, 0.28)",
        brand: "0 8px 24px -4px rgba(238, 156, 24, 0.35)",
        success: "0 8px 24px -4px rgba(32, 164, 100, 0.25)",
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "sonar-ping": "sonar 2.5s cubic-bezier(0, 0, 0.2, 1) infinite",
        "heartbeat": "heartbeat 1.6s ease-in-out infinite",
      },
      keyframes: {
        sonar: {
          "75%, 100%": { transform: "scale(2.2)", opacity: "0" },
        },
        heartbeat: {
          "0%, 100%": { transform: "scale(1)" },
          "14%": { transform: "scale(1.08)" },
          "28%": { transform: "scale(1)" },
          "42%": { transform: "scale(1.08)" },
          "70%": { transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
