/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        main: 'hsl(var(--main))',
        'main-foreground': 'hsl(var(--main-foreground))',
        background: 'hsl(var(--background))',
        'secondary-background': 'hsl(var(--secondary-background))',
        foreground: 'hsl(var(--foreground))',
        border: 'hsl(var(--border))',
        ring: 'hsl(var(--ring))',
        overlay: 'hsl(var(--overlay))',
      },
      fontFamily: {
        sans: ['InterVariable', 'system-ui', 'sans-serif'],
      },
      fontWeight: {
        base: 'var(--base-font-weight)',
        heading: 'var(--heading-font-weight)',
      },
      borderRadius: {
        base: 'var(--border-radius)',
      },
      boxShadow: {
        shadow: 'var(--shadow)',
      },
      spacing: {
        boxShadowX: '4px',
        boxShadowY: '4px',
        reverseBoxShadowX: '-4px',
        reverseBoxShadowY: '-4px',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
}
