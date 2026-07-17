/**
 * Tailwind v4 uses a single PostCSS plugin and handles vendor
 * prefixing internally, so a separate `autoprefixer` entry is no
 * longer needed (and having one alongside v4 would be a mixed/legacy
 * setup we're explicitly avoiding here).
 */
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
