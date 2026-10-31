module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        /* MERZY violet ramp — core from logo ring #5C0AB2 */
        primary: { 50: '#f5efff', 100: '#eae1fd', 200: '#d6c4fb', 300: '#c9b8fa', 400: '#8e4bf0', 500: '#6d2bd0', 600: '#5c0ab2', 700: '#4a1678', 800: '#3a115f', 900: '#260b38' },
        /* MERZY ink ramp — true black canvas */
        dark: { 50: '#f5f3fa', 100: '#e4e0ef', 200: '#c6c0dc', 300: '#a79cc8', 400: '#7b6cab', 500: '#51417a', 600: '#372b59', 700: '#261c3e', 800: '#1c1430', 900: '#151021', 950: '#0b0812' },
        /* Neutral aliases (kept for existing class usage, re-valued to brand) */
        cream: '#f7f6fb',
        paper: '#f7f6fb',
        ivory: '#ffffff',
        sand: '#c9b8fa',
        mediterranean: '#4a1678',
      },
      fontFamily: { sans: ['Outfit', 'sans-serif'], display: ['Sora', 'sans-serif'] },
      animation: { fadeIn: 'fadeIn 0.6s ease-out', slideInUp: 'slideInUp 0.6s ease-out forwards', slideInDown: 'slideInDown 0.6s ease-out forwards', slideInLeft: 'slideInLeft 0.6s ease-out forwards', slideInRight: 'slideInRight 0.6s ease-out forwards', scaleIn: 'scaleIn 0.6s ease-out', bounce: 'bounce 2s infinite', pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite', float: 'float 3s ease-in-out infinite' },
      keyframes: { fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } }, slideInUp: { from: { opacity: '0', transform: 'translateY(30px)' }, to: { opacity: '1', transform: 'translateY(0)' } }, slideInDown: { from: { opacity: '0', transform: 'translateY(-30px)' }, to: { opacity: '1', transform: 'translateY(0)' } }, slideInLeft: { from: { opacity: '0', transform: 'translateX(-30px)' }, to: { opacity: '1', transform: 'translateX(0)' } }, slideInRight: { from: { opacity: '0', transform: 'translateX(30px)' }, to: { opacity: '1', transform: 'translateX(0)' } }, scaleIn: { from: { opacity: '0', transform: 'scale(0.95)' }, to: { opacity: '1', transform: 'scale(1)' } }, bounce: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } }, pulse: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.5' } }, float: { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-8px)' } } },
    },
  },
  plugins: [],
};
