import { nextui } from "@nextui-org/theme";
import colors from "tailwindcss/colors";
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
      // tremor variables
      colors: {
        tremor: {
          brand: {
            faint: colors.blue[50],
            muted: colors.blue[200],
            subtle: colors.blue[400],
            DEFAULT: colors.blue[500],
            emphasis: colors.blue[700],
            inverted: colors.white,
          },
          background: {
            muted: colors.neutral[50],
            subtle: colors.neutral[100],
            DEFAULT: colors.white,
            emphasis: colors.neutral[700],
          },
          border: {
            DEFAULT: colors.neutral[200],
          },
          ring: {
            DEFAULT: colors.neutral[200],
          },
          content: {
            subtle: colors.neutral[400],
            DEFAULT: colors.neutral[500],
            emphasis: colors.neutral[700],
            strong: colors.neutral[900],
            inverted: colors.white,
          },
        },
        // dark mode
        "dark-tremor": {
          brand: {
            faint: "#0B1229",
            muted: colors.blue[950],
            subtle: colors.blue[800],
            DEFAULT: colors.blue[500],
            emphasis: colors.blue[400],
            inverted: colors.blue[950],
          },
          background: {
            muted: "#131A2B",
            subtle: colors.neutral[800],
            DEFAULT: colors.neutral[900],
            emphasis: colors.neutral[300],
          },
          border: {
            DEFAULT: colors.neutral[800],
          },
          ring: {
            DEFAULT: colors.neutral[800],
          },
          content: {
            subtle: colors.neutral[600],
            DEFAULT: colors.neutral[500],
            emphasis: colors.neutral[200],
            strong: colors.neutral[50],
            inverted: colors.neutral[950],
          },
        },
      },
      boxShadow: {
        // light
        "tremor-input": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        "tremor-card":
          "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        "tremor-dropdown":
          "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        // dark
        "dark-tremor-input": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        "dark-tremor-card":
          "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        "dark-tremor-dropdown":
          "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      },
      borderRadius: {
        "tremor-small": "0.375rem",
        "tremor-default": "0.5rem",
        "tremor-full": "9999px",
      },
      fontSize: {
        "tremor-label": ["0.75rem", { lineHeight: "1rem" }],
        "tremor-default": ["0.875rem", { lineHeight: "1.25rem" }],
        "tremor-title": ["1.125rem", { lineHeight: "1.75rem" }],
        "tremor-metric": ["1.875rem", { lineHeight: "2.25rem" }],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
            opacity: 0.5,
          },
          to: { height: "0", opacity: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  darkMode: "class",
  safelist: [
    {
      pattern:
        /^(bg-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ["hover", "ui-selected"],
    },
    {
      pattern:
        /^(text-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ["hover", "ui-selected"],
    },
    {
      pattern:
        /^(border-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ["hover", "ui-selected"],
    },
    {
      pattern:
        /^(ring-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
    {
      pattern:
        /^(stroke-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
    {
      pattern:
        /^(fill-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
  ],
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/container-queries"),
    require("@tailwindcss/typography"),
    require("@headlessui/tailwindcss"),
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
            success: {
              50: colors.lime[50],
              100: colors.lime[100],
              200: colors.lime[200],
              300: colors.lime[300],
              400: colors.lime[400],
              500: colors.lime[500],
              600: colors.lime[600],
              700: colors.lime[700],
              800: colors.lime[800],
              900: colors.lime[900],
              DEFAULT: colors.lime[500],
              foreground: colors.lime[800],
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
            // default reversed
            default: {
              50: colors.neutral[950],
              100: colors.neutral[900],
              200: colors.neutral[800],
              300: colors.neutral[700],
              400: colors.neutral[600],
              500: colors.neutral[500],
              600: colors.neutral[400],
              700: colors.neutral[300],
              800: colors.neutral[200],
              900: colors.neutral[100],
              DEFAULT: colors.neutral[800],
              foreground: colors.neutral[50],
            },
            content1: {
              DEFAULT: "#131313",
              foreground: colors.neutral[50],
            },
            content2: {
              DEFAULT: "#141414",
              foreground: colors.neutral[50],
            },
            content3: {
              DEFAULT: "#151515",
              foreground: colors.neutral[50],
            },
            content4: {
              DEFAULT: "#161616",
              foreground: colors.neutral[50],
            },
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
            success: {
              "50": "#F9FEF1",
              "100": "#F1FCDE",
              "200": "#E5FAC2",
              "300": "#D7F7A1",
              "400": "#CCF585",
              "500": "#BEF264",
              "600": "#A4ED27",
              "700": "#7DBC10",
              "800": "#547F0B",
              "900": "#293D05",
              DEFAULT: "#BEF264",
              foreground: "#293D05",
            },
          },
        },
      },
    }),
  ],
};
