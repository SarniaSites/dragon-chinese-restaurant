/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html', './assets/js/*.js'],
  theme: {
    extend: {
      colors: {
        // Navy from the shopfront fascia and the logo (#283769 in the profile photo), deepened slightly for text contrast
        fascia: { DEFAULT: '#1f2b5e', 50: '#f0f2f8', 100: '#e1e5f1', 200: '#c3cae3', 700: '#18224b', 800: '#141c3f', 900: '#0f1530' },
        // Red of the dining-room lanterns and the headings on the printed menu
        lantern: { DEFAULT: '#c23a2f', 50: '#fcf2ef', 100: '#f8e0da', 600: '#a83026', 700: '#8c271f' },
        // Gold of the "DRAGON" plate on the menu cover
        gold: { DEFAULT: '#d9b56a', 100: '#f6ecd4', 200: '#ecd7a8', 600: '#a8812f' },
        // Cream from the logo (#e5d9ca) and the menu card paper
        paper: { DEFAULT: '#f7f0e4', 50: '#fcf9f3', 100: '#f9f4eb', 200: '#efe5d4', 300: '#e5d9ca' },
        // Vegetarian marker green (the menu's broccoli symbol)
        leaf: '#3f7d4a',
        ink: '#1b1e2c',
        muted: '#5b5f70',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Figtree', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      maxWidth: { site: '76rem' },
      keyframes: {
        sway: { '0%,100%': { transform: 'rotate(-3deg)' }, '50%': { transform: 'rotate(3deg)' } },
        steam: { '0%': { transform: 'translateY(8px)', opacity: '0' }, '30%': { opacity: '.9' }, '100%': { transform: 'translateY(-22px)', opacity: '0' } },
        glow: { '0%,100%': { opacity: '.25' }, '50%': { opacity: '.55' } },
      },
      animation: {
        sway: 'sway 5.5s ease-in-out infinite',
        'sway-slow': 'sway 7s ease-in-out infinite',
        steam: 'steam 3.6s ease-out infinite',
        glow: 'glow 5.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
