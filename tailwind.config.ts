import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        sm: '600px',
        md: '728px',
        lg: '984px',
        xl: '1240px',
        '2xl': '1496px',
      },
    },
    extend: {
      keyframes: {
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
        shine: {
          "100%": { transform: "translateX(100%)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        blob: "blob 7s infinite",
        shine: "shine 2s infinite",
        shimmer: "shimmer 1.5s infinite",
      },
      colors: {
        primary: {
          DEFAULT: "#6366f1",
          hover: "#4f46e5",
        },
        secondary: "#f43f5e",
        warning: "#f59e0b",
        info: "#3b82f6",
        success: "#10b981",
        danger: "#ef4444",
        dark: "#1e293b",
        light: "#f8fafc",
      },
    },
  },
  plugins: [],
};
export default config;
