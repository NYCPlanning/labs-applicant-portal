import Application from '@ember/application';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import defineModifier from 'ember-concurrency-test-waiter/define-modifier';
import config from '../config/environment';

// provides better test support for tasks
// https://github.com/bendemboski/ember-concurrency-test-waiter#usage
defineModifier();

export default class App extends Application {
  modulePrefix = config.modulePrefix;

  podModulePrefix = config.podModulePrefix;

  Resolver = Resolver;
}

loadInitializers(App, config.modulePrefix);
