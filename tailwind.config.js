/** @type {import('tailwindcss').Config} */
module.exports = {
  // app.js builds markup from class strings, so it is a content source too
  content: ['./index.html', './privacy.html', './app.js', './i18n/*.{js,mjs}'],
  theme: {
    extend: {
      colors: {
        // Steppe-noon palette (src/input.css :root). Token names are kept: i18n/pages.mjs matches
        // privacy.html fragments that contain these class names.
        paper: '#FFFDF9', ink: '#1A1511', mut: '#4A3F35', mutd: '#D9CBB4', line: '#CDBFA9',
        gold: '#C9932A', golddeep: '#7A4F0C', stone: '#E8DFD1', felt: '#F7F4EF', blue: '#2B3FB8'
      },
      fontFamily: { disp: ['var(--f)'], sans: ['var(--f)'] }
    }
  }
};
