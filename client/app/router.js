import EmberRouter from '@ember/routing/router';
import config from './config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;

  rootURL = config.rootURL;
}

// TODO: wrap in an authenticated route
Router.map(function() { // eslint-disable-line
  this.route('projects');
  this.route('login');
  this.route('logout');

  this.route('packages', function () {
    this.route('edit', { path: ':id/edit' });
    this.route('show', { path: ':id' });
  });
});
