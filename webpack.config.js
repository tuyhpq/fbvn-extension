const path = require('path');

const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    "popup.js": "./fbvn-friends/popup.js",
    "content.js": "./fbvn-friends/content.js",
    "background.js": "./fbvn-friends/background.js"
  },
  output: {
    filename: "[name]",
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new CopyPlugin([
      { from: './fbvn-friends/manifest.json', to: 'manifest.json' },
      { from: './fbvn-friends/popup.html', to: 'popup.html' },
      { from: './fbvn-friends/assets/img', to: 'assets/img' },
      { from: './fbvn-friends/assets/css', to: 'assets/css' },
      { from: './node_modules/bootstrap/dist/css/bootstrap.min.css', to: 'assets/css/bootstrap.min.css' },
      { from: './node_modules/jquery/dist/jquery.min.js', to: 'assets/js/jquery.min.js' },
      { from: './node_modules/popper.js/dist/umd/popper.min.js', to: 'assets/js/popper.min.js' },
      { from: './node_modules/bootstrap/dist/js/bootstrap.min.js', to: 'assets/js/bootstrap.min.js' }
    ]),
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
