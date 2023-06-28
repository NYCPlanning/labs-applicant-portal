const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = {
  node: {
    global: false,
    path: true,
    __filename: false,
    __dirname: false,
  },
  resolve: {
    alias: {
      console: require.resolve('console-browserify'),
      constants: require.resolve('constants-browserify'),
      crypto: require.resolve('crypto-browserify'),
      ember: path.join(__dirname, './ember'),
      https: require.resolve('https-browserify'),
      os: require.resolve('os-browserify/browser'),
      path: require.resolve('path-browserify'),
      stream: require.resolve('stream-browserify'),
      timers: require.resolve('timers-browserify,'),
      tty: require.resolve('tty-browserify,'),
      vm: require.resolve('vm-browserify'),
      zlib: require.resolve('browserify-zlib'),
    }
  },
};
