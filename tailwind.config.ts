import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#ff2d55",
        "primary-dark": "#cc1f3f",
        "primary-light": "#ff6b8a",
        background: "#0f0f0f",
        card: "#1a1a1a",
        surface: "#222222",
        "surface-2": "#2a2a2a",
        "text-muted": "#888888",
        "text-secondary": "#aaaaaa",
        border: "#2a2a2a",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-primary": "linear-gradient(135deg, #ff2d55 0%, #ff6b35 100%)",
        "hero-gradient":
          "linear-gradient(to top, rgba(15,15,15,1) 0%, rgba(15,15,15,0.7) 40%, rgba(15,15,15,0.2) 70%, transparent 100%)",
        "card-gradient":
          "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%)",
      },
      animation: {
        "spin-slow": "spin 1.5s linear infinite",
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
        shimmer: "shimmer 1.5s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      screens: {
        xs: "480px",
      },
      aspectRatio: {
        poster: "2 / 3",
      },
    },
  },
  plugins: [],
};

export default config;
