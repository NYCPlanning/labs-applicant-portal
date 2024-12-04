import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { inject as service } from '@ember/service';

export default class ProjectsNewRoute extends Route.extend(
  AuthenticatedRouteMixin,
) {
  authenticationRoute = '/';

  @service
  store

  async model() {
    const projectsNewForm = this.store.createRecord('project-new');

    projectsNewForm.id = `new${self.crypto.randomUUID()}`;
    projectsNewForm.createFileQueue();

    return projectsNewForm;
  }
}
