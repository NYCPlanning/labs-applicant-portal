import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

// model of this route is all projects
// will have associated controller, which will handle business logic of sorting project
// objects into appropriate buckets
export default class ProjectsRoute extends Route {
  @service session;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');
  }

  // where we define the model of this part of the application
  model(params) {
    return this.store.query('project', { include: 'packages.pasForm', ...params });
  }

  @action
  error(error) {
    if (error.errors[0].status === 403) {
      this.session.invalidate();

      this.transitionTo('index');
    } else {
      // Let the route above this handle the error.
      return true;
    }
  }
}
