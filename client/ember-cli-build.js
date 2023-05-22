const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    sassOptions: {
      includePaths: [
        'node_modules/foundation-sites/scss',
        'node_modules/nyc-planning-style-guide/dist/assets/scss',
      ],
      onlyIncluded: true,
      sourceMap: false,
    },
    autoprefixer: {
      enabled: true,
      cascade: true,
      sourcemap: false,
    },
    'ember-composable-helpers': {
      only: ['toggle', 'map-by', 'reduce', 'includes', 'group-by', 'sort-by', 'keys'],
    },
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  return app.toTree();
};
