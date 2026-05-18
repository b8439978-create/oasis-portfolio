import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        oasis: {
          white: '#ffffff',
          black: '#000000',
          dark: '#0a0a0a',
          light: '#f5f5f5',
          gray: {
            100: '#f0f0f0',
            200: '#e0e0e0',
            300: '#c0c0c0',
            400: '#a0a0a0',
            500: '#808080',
            600: '#606060',
            700: '#404040',
            800: '#2a2a2a',
            900: '#1a1a1a',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
