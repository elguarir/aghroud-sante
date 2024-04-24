import { nextui } from "@nextui-org/theme";
import colors from "tailwindcss/colors";
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
    },
  },
  darkMode: "class",
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/container-queries"),
    nextui({
      themes: {
        light: {
          colors: {
            default: {
              "50": colors.neutral[50],
              "100": colors.neutral[100],
              "200": colors.neutral[200],
              "300": colors.neutral[300],
              "400": colors.neutral[400],
              "500": colors.neutral[500],
              "600": colors.neutral[600],
              "700": colors.neutral[700],
              "800": colors.neutral[800],
              "900": colors.neutral[900],
              DEFAULT: colors.neutral[200],
              foreground: colors.black,
            },
            // secondary: {
            //   50: "#E7E7E9",
            //   100: "#CDCDD0",
            //   200: "#9B9BA2",
            //   300: "#6A6A72",
            //   400: "#3B3B3F",
            //   500: "#0D0D0E",
            //   600: "#0A0A0B",
            //   700: "#070708",
            //   800: "#050505",
            //   900: "#020203",
            //   DEFAULT: "#CDCDD0",
            //   foreground: "#050505",
            // },
            secondary: {
              50: "#E8E8E8",
              100: "#D1D1D1",
              200: "#A3A3A3",
              300: "#737373",
              400: "#454545",
              500: "#171717",
              600: "#121212",
              700: "#0D0D0D",
              800: "#0A0A0A",
              900: "#050505",
              DEFAULT: "#0D0D0D",
              foreground: "#E8E8E8",
            },
          },
        },
        dark: {
          colors: {
            // secondary: {
            //   50: "#E7E7E9",
            //   100: "#CDCDD0",
            //   200: "#9B9BA2",
            //   300: "#6A6A72",
            //   400: "#3B3B3F",
            //   500: "#0D0D0E",
            //   600: "#0A0A0B",
            //   700: "#070708",
            //   800: "#050505",
            //   900: "#020203",
            //   DEFAULT: "#0D0D0E",
            //   foreground: "#E7E7E9",
            // },
            secondary: {
              // light secondary reversed
              50: "#020203",
              100: "#050505",
              200: "#070708",
              300: "#0A0A0B",
              400: "#0D0D0E",
              500: "#3B3B3F",
              600: "#6A6A72",
              700: "#9B9BA2",
              800: "#CDCDD0",
              900: "#E7E7E9",
              DEFAULT: "#E7E7E9",
              foreground: "#0D0D0E",
            },
          },
        },
      },
    }),
  ],
};
