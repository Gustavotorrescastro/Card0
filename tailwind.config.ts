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
        brand: {
          primary: '#F72717',
          secondary: '#162056',
          tertiary: '#7FC2E4',
          teal: '#7FC2E4',
          accent: '#E1EA80',
          lime: '#E1EA80',
          light: '#7FC2E4',
          white: '#F5F5F5',
          background: '#F5F5F5',
          surface: '#FFFFFF',
          text: '#252525',
          textSecondary: '#666666',
          border: '#E5E5E5',
        },
      },
      fontFamily: {
        sans: ['var(--font-montserrat)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config