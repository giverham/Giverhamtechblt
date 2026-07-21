/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'cyan-accent': '#00E5FF',
        'teal-accent': '#00FFD1',
      },
      fontFamily: {
        sans:  ['Inter', 'system-ui', 'sans-serif'],
        mono:  ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'rotate-slow':   'rotateSlow 20s linear infinite',
        'rotate-rev':    'rotateReverse 25s linear infinite',
        'orb-pulse':     'orbPulse 4s ease-in-out infinite',
        'float':         'floatY 7s ease-in-out infinite',
        'float-xy':      'floatXY 9s ease-in-out infinite',
        'glow-pulse':    'glowPulse 3s ease-in-out infinite',
        'blink':         'blink 1s step-end infinite',
        'shimmer-sweep': 'shimmerSweep 5s linear infinite',
        'spin-slow':     'rotateSlow 20s linear infinite',
      },
      keyframes: {
        rotateSlow:    { from: { transform: 'rotate(0deg)'   }, to: { transform: 'rotate(360deg)'  } },
        rotateReverse: { from: { transform: 'rotate(360deg)' }, to: { transform: 'rotate(0deg)'    } },
        orbPulse:      { '0%,100%': { transform: 'scale(1)',    opacity: '0.6' }, '50%': { transform: 'scale(1.15)', opacity: '1' } },
        floatY:        { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-18px)' } },
        floatXY: {
          '0%':   { transform: 'translate(0,0) rotate(0deg)' },
          '33%':  { transform: 'translate(6px,-14px) rotate(1.5deg)' },
          '66%':  { transform: 'translate(-4px,-8px) rotate(-1deg)' },
          '100%': { transform: 'translate(0,0) rotate(0deg)' },
        },
        glowPulse: {
          '0%,100%': { boxShadow: '0 0 20px rgba(0,229,255,0.12)' },
          '50%':     { boxShadow: '0 0 40px rgba(0,229,255,0.22), 0 0 80px rgba(0,229,255,0.06)' },
        },
        blink: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0' } },
        shimmerSweep: {
          from: { backgroundPosition: '200% center' },
          to:   { backgroundPosition: '-200% center' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
