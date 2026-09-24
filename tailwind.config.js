/** @type {import('tailwindcss').Config} */
module.exports = {
  // app.js builds markup from class strings, so it is a content source too
  content: ['./index.html', './privacy.html', './app.js', './i18n/*.{js,mjs}'],
  theme: {
    extend: {
      colors: {
        paper: '#FAF6EE', cream: '#F1EADB', ink: '#181410', ink2: '#221D16',
        line: '#E6DEC9', gold: '#C89A3C', gold2: '#E2B75C',
        // Darkened from #A67C28 to pass WCAG AA on light backgrounds (5.7:1)
        golddeep: '#7E5B1C',
        mut: '#6F6553', mutd: '#A99F8C', green: '#3E9B5F'
      },
      // Resolved per language in src/input.css (Kazakh needs other families)
      fontFamily: { disp: ['var(--f-disp)'], sans: ['var(--f-sans)'] }
    }
  }
};
