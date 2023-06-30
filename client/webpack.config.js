const path = require('path');
import config from './app/config/environment';

module.exports = {
  entry: './app/app.js',
  mode: config.environment
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'css-loader',
             options: {
              modules: true,
            },
          },
        ],
      },
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
      },
    ],
  },

  node: {
    global: true,
    __filename: false,
    __dirname: false,
  },

  resolve: {
    fallback: {
      // make sure you `npm install path-browserify` to use this
      path: require.resolve('path-browserify'),
      fs: false,
    },

    alias: {
      ember: path.join(__dirname, './ember'),
      modules: ['node_modules'],
    },
  },
};
