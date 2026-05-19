/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1400px",
      },
    },

    extend: {
      colors: {
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",

        card: "rgb(var(--card) / <alpha-value>)",
        "card-foreground":
          "rgb(var(--card-foreground) / <alpha-value>)",

        popover: "rgb(var(--popover) / <alpha-value>)",
        "popover-foreground":
          "rgb(var(--popover-foreground) / <alpha-value>)",

        primary: "rgb(var(--primary) / <alpha-value>)",
        "primary-foreground":
          "rgb(var(--primary-foreground) / <alpha-value>)",

        secondary: "rgb(var(--secondary) / <alpha-value>)",
        "secondary-foreground":
          "rgb(var(--secondary-foreground) / <alpha-value>)",

        muted: "rgb(var(--muted) / <alpha-value>)",
        "muted-foreground":
          "rgb(var(--muted-foreground) / <alpha-value>)",

        accent: "rgb(var(--accent) / <alpha-value>)",
        "accent-foreground":
          "rgb(var(--accent-foreground) / <alpha-value>)",

        destructive:
          "rgb(var(--destructive) / <alpha-value>)",

        success: "rgb(var(--success) / <alpha-value>)",

        border: "rgb(var(--border) / <alpha-value>)",
        input: "rgb(var(--input) / <alpha-value>)",
        ring: "rgb(var(--ring) / <alpha-value>)",
      },

      borderRadius: {
        xl: "var(--radius)",
        "2xl": "calc(var(--radius) + 4px)",
      },

      boxShadow: {
        soft: "0 8px 30px rgba(0,0,0,0.08)",
      },

      backgroundImage: {
        "gradient-primary":
          "linear-gradient(135deg, rgb(var(--primary)), rgb(var(--accent)))",

        "gradient-hero":
          "linear-gradient(180deg, rgb(var(--background)), rgb(var(--secondary)))",
      },
    },
  },

  plugins: [require("tailwindcss-animate")],
};