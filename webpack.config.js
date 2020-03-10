require('dotenv').config();
const path = require('path');

const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    "popup.js": "./src/popup.js",
    "content.js": "./src/content.js",
    "background.js": "./src/background.js"
  },
  output: {
    filename: "[name]",
    path: path.resolve(__dirname, 'fbvn-' + process.env.APP_CODE)
  },
  plugins: [
    new CopyPlugin([
      { from: './src/manifest.json', to: 'manifest.json' },
      { from: './src/popup.html', to: 'popup.html' },
      { from: './src/assets/css', to: 'assets/css' },
      { from: './src/assets/img', to: 'assets/img' },
      { from: './node_modules/jquery/dist/jquery.min.js', to: 'assets/js/jquery.min.js' },
      { from: './node_modules/popper.js/dist/umd/popper.min.js', to: 'assets/js/popper.min.js' },
      { from: './node_modules/bootstrap/dist/js/bootstrap.min.js', to: 'assets/js/bootstrap.min.js' },
      { from: './node_modules/bootstrap/dist/css/bootstrap.min.css', to: 'assets/css/bootstrap.min.css' }
    ])
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  },
  performance: {
    hints: false
  }
};
