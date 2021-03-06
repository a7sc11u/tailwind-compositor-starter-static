const tailwindcss = require('tailwindcss');
const { compositor } = require('tailwind-compositor');
const purgecss = require('@fullhuman/postcss-purgecss');

const compositorConfig = require('./compositor.config.js');
const tailwindConfig = require('./tailwind.config.js');

const tailwindConfigComposed = compositor(compositorConfig)(tailwindConfig);
module.exports = {
  plugins: [
    require('postcss-import')({
      plugins: [require('stylelint')],
    }),

    // tailwindcss
    tailwindcss(tailwindConfigComposed),

    // purge on build
    ...(process.env.NODE_ENV === 'production'
      ? [
          purgecss({
            defaultExtractor: (content) =>
              content.match(/[\w-/:]+(?<!:)/g) || [],
            content: ['./src/*.html'],
          }),
        ]
      : []),

    // preset env
    require('postcss-preset-env')({
      stage: 1,
      autoprefixer: { grid: true },
      features: {
        'nesting-rules': true,
      },
      browsers: ['> 1%', 'last 2 versions', 'Firefox ESR'],
    }),
  ],
};
