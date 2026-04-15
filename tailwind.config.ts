import type { Config } from 'tailwindcss'

const config: Config = {
  // ESSENCIAL: Define que a mudança de tema é via classe no HTML
  darkMode: 'class', 
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/context/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        edenred: {
          primary: '#E2001A',
          secondary: '#B00014',
          background: '#F4F4F4',
          surface: '#FFFFFF',
          text: '#1D1D1B',
          textSecondary: '#666666',
          border: '#E5E5E5',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config