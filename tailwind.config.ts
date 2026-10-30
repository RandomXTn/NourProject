import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Luxury brand palette
        obsidian: {
          DEFAULT: "#090909",
          50: "#141414",
          100: "#1a1a1a",
          200: "#242424",
          300: "#2e2e2e",
        },
        gold: {
          DEFAULT: "#C8A45D",
          light: "#E4CC91",
          dark: "#A8843D",
          muted: "#8B6D3F",
        },
        ivory: {
          DEFAULT: "#F7F3EA",
          muted: "#E8E3D8",
          dark: "#D4CFC5",
        },
        stone: {
          DEFAULT: "#A8A29A",
          dark: "#6B6560",
          light: "#C5BFB8",
        },
        border: {
          DEFAULT: "#30291E",
          light: "#3D3228",
          subtle: "#1C1812",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },
      maxWidth: {
        "8xl": "90rem",
        "9xl": "100rem",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-in-left": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        shimmer: "shimmer 2s linear infinite",
        "fade-up": "fade-up 0.6s ease-out forwards",
        "fade-in": "fade-in 0.4s ease-out forwards",
        "slide-in-right": "slide-in-right 0.4s ease-out forwards",
        "slide-in-left": "slide-in-left 0.4s ease-out forwards",
        "scale-in": "scale-in 0.3s ease-out forwards",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      backgroundImage: {
        "gold-gradient":
          "linear-gradient(135deg, #C8A45D 0%, #E4CC91 50%, #C8A45D 100%)",
        "dark-gradient":
          "linear-gradient(180deg, #090909 0%, #141414 100%)",
        "hero-gradient":
          "linear-gradient(to bottom, rgba(9,9,9,0) 0%, rgba(9,9,9,0.4) 50%, rgba(9,9,9,0.85) 100%)",
      },
      backdropBlur: {
        xs: "2px",
      },
      transitionTimingFunction: {
        luxury: "cubic-bezier(0.25, 0.1, 0.25, 1)",
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [animate],
};

export default config;
