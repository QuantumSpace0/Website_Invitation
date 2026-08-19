/** @type {import('tailwindcss').Config} */
// ⚠️  RECONSTRUCTED from detected class usage — verify before using
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        // Detected CSS custom properties:
        'tw-ring-color': 'rgb(59 130 246 / .5)',
        'tw-ring-offset-color': 'hsl(var(--background)',
        // Detected color usage: 
      },
      fontFamily: {
        // Detected fonts from CSS: Candlescript, ui-sans-serif, ui-monospace, inherit, Cormorant Garamond, Cinzel, Noto Color Emoji
        'candlescript': ['Candlescript', 'sans-serif'],
        'ui-sans-serif': ['ui-sans-serif', 'sans-serif'],
        'ui-monospace': ['ui-monospace', 'sans-serif'],
        'inherit': ['inherit', 'sans-serif'],
        'cormorant-garamond': ['Cormorant Garamond', 'sans-serif'],
        'cinzel': ['Cinzel', 'sans-serif'],
        'noto-color-emoji': ['Noto Color Emoji', 'sans-serif'],
      },
      borderRadius: {
        // Detected values: 1rem, 2px, inherit, 9999px, var(--radius), calc(var(--radius) - 2px)
      },
      boxShadow: {
        // Detected values:
        'custom-0': 'var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow',
        'custom-1': 'var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-',
        'custom-2': 'var(--shadow-elegant)',
        'custom-3': 'var(--shadow-soft)',
        'custom-4': 'var(--shadow-gold)',
      },
      screens: {
        // Detected breakpoints: 1400px, 640px, 768px
      },
      keyframes: {
        // Detected keyframes: pulse, enter, exit, float-petal, drift, shimmer, envelope-open, fade-up, fade-in, accordion-up, accordion-down
      },
    },
  },
  plugins: [
    // Detected — add as needed:
    // require('@tailwindcss/typography'),
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/aspect-ratio'),
  ],
};
