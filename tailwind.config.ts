import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
    './src/app/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        edenred: {
          primary: '#E2001A',    // Vermelho Oficial Edenred
          secondary: '#B00014',  // Vermelho Escuro para Hover
          light: '#FFEBEC',      // Fundo suave rosado/branco
          dark: '#333333',
          background: '#F4F4F4', // Cinza muito claro
          surface: '#FFFFFF',    // Branco puro
          text: '#1D1D1B',
          textSecondary: '#666666',
          border: '#E5E5E5',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config