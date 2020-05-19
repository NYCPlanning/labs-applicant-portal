import EmberRouterScroll from 'ember-router-scroll';
import config from './config/environment';

export default class Router extends EmberRouterScroll {
  location = config.locationType;

  rootURL = config.rootURL;
}

// TODO: wrap in an authenticated route
Router.map(function() { // eslint-disable-line
  this.route('projects');
  this.route('login');
  this.route('logout');

  this.route('packages', { path: 'packages/:id' }, function () {
    this.route('edit');
    this.route('show', { path: '/' });
  });
});
