/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        aira: {
          orange: '#F2541A',
          deep: '#D6420B',
          cream: '#FBF7EC',
          paper: '#FAF6EE',
          dark: '#0A0A0A',
          bezel: '#E85B24',
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        pixel: ['var(--font-pixel)', 'monospace'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
