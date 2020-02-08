const path = require('path');

module.exports = {
  stories: ['../stories/*.stories.ts'],
  webpackFinal: async config => {
    config.module.rules.push({
      test: /\.(ts)$/,
      use: [
        {
          loader: require.resolve('awesome-typescript-loader'),
        },
        // Optional
        {
          loader: require.resolve('react-docgen-typescript-loader'),
        },
      ],
    });
    config.module.rules.push({
      test: /\.s[ac]ss$/i,
      use: [
        'style-loader',   // Creates `style` nodes from JS strings
        'css-loader',     // Translates CSS into CommonJS
        'sass-loader',    // Compiles Sass to CSS
      ],
    });
    config.resolve.extensions.push('.ts', '.tsx', '.js', '.css', '.scss');
    return config;
  },
  addons: [
    // '@storybook/preset-typescript',
    '@storybook/addon-viewport/register',
    '@storybook/addon-knobs/register',
    '@storybook/addon-actions/register',
  ],
};
