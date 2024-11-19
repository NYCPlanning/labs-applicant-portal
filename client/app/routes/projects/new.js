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
    const projectNew = await this.store.createRecord('project-new');
    projectNew.id = 'new';
    projectNew.createFileQueue();
    return projectNew;
  }
}
