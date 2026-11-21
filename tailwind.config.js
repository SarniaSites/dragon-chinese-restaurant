/** @type {import('tailwindcss').Config} */
// Every colour comes from the restaurant itself — mostly the shopfront fascia on Southside.
module.exports = {
  content: ['./*.html', './assets/js/*.js'],
  theme: {
    extend: {
      colors: {
        // Royal blue of the fascia board and window frames (sampled #0f2b8d–#1c3399 in the sunlit shopfront photo)
        fascia: {
          50: '#eef1fb', 100: '#dce2f5', 200: '#b7c3ea', 300: '#8a9bd8',
          DEFAULT: '#16309a', 600: '#132a86', 700: '#102473', 800: '#0c1b57', 900: '#0a1442',
        },
        // Red of the paper lanterns in the dining room and the printed menu headings — the one "action" colour
        lantern: { DEFAULT: '#c0272d', 600: '#a51f25', 700: '#8a1a1f', 50: '#fcf0ef', 100: '#f8dcda' },
        // Gold of the key-fret border painted round the fascia
        fret: { DEFAULT: '#c8a14a', 200: '#ecdcb0', 300: '#dcc07c', 700: '#8e6f25' },
        // Cream of the painted front wall and the dining-room walls (used as the page ground)
        wall: { DEFAULT: '#f7f2e8', 50: '#fcfaf5', 100: '#faf6ee', 200: '#efe7d6', 300: '#e3d8c2' },
        // Text: a very dark version of the fascia blue
        ink: { DEFAULT: '#111737', soft: '#454b69' },
        // Vegetarian marker (the menu's broccoli symbol)
        leaf: '#2f7a3e',
      },
      fontFamily: {
        display: ['Rufina', 'Georgia', 'serif'],
        body: ['"Red Hat Text Variable"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        hand: ['Kalam', '"Comic Sans MS"', 'cursive'],
      },
      maxWidth: { site: '78rem' },
      boxShadow: {
        ticket: '0 1px 0 rgba(17,23,55,.06), 0 18px 40px -18px rgba(17,23,55,.35)',
      },
    },
  },
  plugins: [],
};
