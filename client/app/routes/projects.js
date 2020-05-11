import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

// model of this route is all projects
// will have associated controller, which will handle business logic of sorting project
// objects into appropriate buckets
export default class ProjectsRoute extends Route.extend(AuthenticatedRouteMixin) {
  authenticationRoute = '/';

  // where we define the model of this part of the application
  model(params) {
    return this.store.query('project', { include: 'packages.pasForm', ...params });
  }
}
