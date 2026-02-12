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
        'yo-green': {
          DEFAULT: '#1B7A3D',
          dark: '#145C2E',
          light: '#2EA55A',
          pale: '#E8F5ED',
        },
        'yo-orange': {
          DEFAULT: '#F37021',
          dark: '#D45A10',
          light: '#FF8C42',
          pale: '#FFF0E5',
        },
        'yo-gray': {
          50: '#F8F8F6',
          100: '#F0F0EE',
          200: '#E0E0DD',
          300: '#C8C8C4',
          400: '#9E9E98',
          500: '#7A7A74',
          600: '#5A5A55',
          800: '#2D2D2A',
        },
        'yo-off-white': '#FAFAF8',
        'yo-black': '#1A1A18',
      },
      fontFamily: {
        display: ['Montserrat', 'sans-serif'],
        body: ['Nunito', 'sans-serif'],
      },
      borderRadius: {
        'yo-sm': '8px',
        'yo-md': '12px',
        'yo-lg': '16px',
        'yo-xl': '24px',
      },
      boxShadow: {
        'yo-sm': '0 1px 3px rgba(0,0,0,0.06)',
        'yo-md': '0 4px 16px rgba(0,0,0,0.08)',
        'yo-lg': '0 8px 32px rgba(0,0,0,0.12)',
        'yo-xl': '0 16px 48px rgba(0,0,0,0.16)',
      },
    },
  },
  plugins: [],
};
export default config;
