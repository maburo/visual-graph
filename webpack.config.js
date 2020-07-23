const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHotPlugin = require('html-webpack-hot-plugin');
const htmlHotPlugin = new HtmlWebpackHotPlugin({ hot: true })

module.exports = {
  entry: './src/index.tsx',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.css', '.scss']
  },
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'bundle.min.js'
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    // compress: true,
    port: 9000,
    open: false,
    before(app, server) {
      htmlHotPlugin.setDevServer(server)
    },
  },
  module: {
    rules: [
      { 
        test: /\.svg$/, 
        loader: 'svg-inline-loader' 
      },
      {
        test: /\.ts(x*)?$/,
        loader: 'awesome-typescript-loader'
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',   // Creates `style` nodes from JS strings
          'css-loader',     // Translates CSS into CommonJS
          'sass-loader',    // Compiles Sass to CSS
        ],
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    htmlHotPlugin
  ]
}