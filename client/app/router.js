import EmberRouter from '@ember/routing/router';
import config from './config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;

  rootURL = config.rootURL;
}

Router.map(function() { // eslint-disable-line
  this.route('login');
  // Nest all routes that require user login under this 'authenticated' route:
  this.route('authenticated', { path: '' }, function() {
    this.route('projects');
  });
});
