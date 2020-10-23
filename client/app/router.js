import EmberRouterScroll from 'ember-router-scroll';
import config from './config/environment';

export default class Router extends EmberRouterScroll {
  location = config.locationType;

  rootURL = config.rootURL;
}

// TODO: wrap in an authenticated route
Router.map(function() {
  // eslint-disable-line
  this.route('projects');
  this.route('login');
  this.route('logout');

  this.route('pas-form', { path: 'pas-form/:id' }, function () {
    this.route('edit');
    this.route('show', { path: '/' });
  });

  this.route('rwcds-form', { path: 'rwcds-form/:id' }, function () {
    this.route('edit');
    this.route('show', { path: '/' });
  });

  this.route('landuse-form', { path: 'landuse-form/:id' }, function () {
    this.route('edit');
    this.route('show', { path: '/' });
  });

  this.route('draft-eas', { path: 'draft-eas/:id' }, function () {
    this.route('edit');
    this.route('show', { path: '/' });
  });

  this.route('filed-eas', { path: 'filed-eas/:id' }, function () {
    this.route('edit');
    this.route('show', { path: '/' });
  });

  this.route('deis', { path: 'deis/:id' }, function () {
    this.route('edit');
    this.route('show', { path: '/' });
  });

  this.route('project', { path: 'projects/:id' });

  this.route('auth', function() {
    this.route('login');
    this.route('register');
    this.route('validate');
    this.route('sync');
  });

  this.route('invoice', { path: 'invoices/:id' });
});
