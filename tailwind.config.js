export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          900: "#0F1B2D",
          800: "#152438",
          700: "#1C2F47",
        },
        emerald: {
          600: "#14795A",
          500: "#1A9370",
        },
        amber: {
          500: "#C9822A",
        },
        rose: {
          600: "#C1443A",
        },
        slate: {
          50: "#F7F8FA",
          100: "#EEF1F4",
          200: "#DEE3E8",
          400: "#8B96A3",
          600: "#4B5A6B",
          800: "#26313F",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["'Space Grotesk'", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
}

