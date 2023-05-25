module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      legacyDecorators: true,
    },
  },
  plugins: ['ember'],
  extends: [
    'eslint:recommended',
    'plugin:ember/recommended',
    'airbnb-base',
  ],
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  rules: {
    'array-callback-return': 1,
    camelcase: 0,
    'class-methods-use-this': 0,
    'consistent-return': 1,
    'default-case': 1,
    'ember/avoid-leaking-state-in-ember-objects': 0,
    'ember/no-jquery': 'error',
    eqeqeq: 1,
    'func-names': 0,
    'implicit-arrow-linebreak': 1,
    'import/extensions': 0,
    'import/named': 0,
    'import/no-extraneous-dependencies': 0,
    'import/no-named-as-default': 1,
    'import/no-named-as-default-member': 1,
    'import/no-unresolved': 0,
    'import/prefer-default-export': 1,
    'lines-around-directive': 0,
    'max-len': 0,
    'no-mixed-operators': 1,
    'no-mixins': 0,
    'no-nested-ternary': 1,
    'no-param-reassign': 0,
    'no-plusplus': 1,
    'no-restricted-globals': 1,
    'no-restricted-properties': 1,
    'no-restricted-syntax': 1,
    'no-return-assign': 1,
    'no-return-await': 1,
    'no-shadow': 1,
    'no-underscore-dangle': 0,
    'no-use-before-define': 0,
    'operator-linebreak': 1,
    'prefer-arrow-callback': 0,
    'prefer-const': 1,
    'prefer-promise-reject-errors': 1,
    'prefer-rest-params': 1,
    'space-before-function-paren': 0,
  },
  overrides: [
    // node files
    {
      files: [
        './.eslintrc.js',
        './.prettierrc.js',
        './.template-lintrc.js',
        './ember-cli-build.js',
        './testem.js',
        './blueprints/*/index.js',
        './config/**/*.js',
        './lib/*/index.js',
        './server/**/*.js',
      ],
      parserOptions: {
        sourceType: 'script',
      },
      env: {
        browser: false,
        node: true,
        es6: true,
      },
      plugins: ['node'],
      // extends: ['plugin:node/recommended'],
      rules: {
        ...require('eslint-plugin-node').configs.recommended.rules, // eslint-disable-line
        // this can be removed once the following is fixed
        // https://github.com/mysticatea/eslint-plugin-node/issues/77
        'node/no-unpublished-require': 'off',
      },
    },
    {
      // Test files:
      files: ['tests/**/*-test.{js,ts}'],
      // extends: ['plugin:qunit/recommended'],
    },
  ],
};
