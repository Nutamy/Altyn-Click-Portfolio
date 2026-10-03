/** @type {import('tailwindcss').Config} */
module.exports = {
  // app.js builds markup from class strings, so it is a content source too
  content: ['./index.html', './privacy.html', './app.js', './i18n/*.{js,mjs}'],
  theme: {
    extend: {
      colors: {
        // Liquid Glass palette. Legacy token names (paper, gold, golddeep…) are kept on purpose:
        // the i18n dictionary matches markup fragments that contain these class names.
        paper: '#F5F7FA', cream: '#F3ECE5', ink: '#141A21', ink2: '#1C2733',
        line: '#D6DEE8',
        // "gold" is now the violet accent; the warm amber survives only as a rare accent (see `amber`)
        gold: '#7164F5', gold2: '#8DE8E2',
        // Deep violet for text on light glass (6.2:1 on #EEF0F5)
        golddeep: '#4B3FD6',
        mut: '#48515C', mutd: '#C6D0DA', green: '#2F9E6A',
        slate: '#263746', slate2: '#536879', ivory: '#F8F2EC',
        violet: '#7164F5', blue: '#6475F5', cyan: '#68DDD7', aqua: '#8DE8E2',
        lav: '#BCA8F8', pink: '#E9A6E7', amber: '#FFB84D'
      },
      // Resolved per language in src/input.css (Kazakh needs other families)
      fontFamily: { disp: ['var(--f-disp)'], sans: ['var(--f-sans)'] }
    }
  }
};
