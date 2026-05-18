/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        /* warm museum-light luxury palette */
        bg: '#EFE8DA',
        'bg-deep': '#E5DBC6',
        surface: '#F7F2E7',
        noir: '#171109',
        'noir-soft': '#241B10',
        ink: '#211A12',
        'ink-soft': '#4A3D2C',
        muted: '#8B7B62',
        gold: '#A6824C',
        'gold-light': '#C6A36A',
        hairline: '#D4C7AC',
        'hairline-dark': '#3A2E1C',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        label: ['Jost', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        label: '0.22em',
        wide2: '0.34em',
      },
      maxWidth: {
        shell: '1440px',
      },
      transitionTimingFunction: {
        lux: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translate3d(0,0,0)' },
          '100%': { transform: 'translate3d(-50%,0,0)' },
        },
        spinslow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        bob: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        blink: {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        grain: {
          '0%,100%': { transform: 'translate(0,0)' },
          '20%': { transform: 'translate(-3%,2%)' },
          '40%': { transform: 'translate(2%,-3%)' },
          '60%': { transform: 'translate(-2%,-2%)' },
          '80%': { transform: 'translate(3%,3%)' },
        },
      },
      animation: {
        marquee: 'marquee 38s linear infinite',
        spinslow: 'spinslow 26s linear infinite',
        bob: 'bob 6s ease-in-out infinite',
        blink: 'blink 1.1s steps(1) infinite',
        grain: 'grain 0.7s steps(4) infinite',
      },
    },
  },
  plugins: [],
};
