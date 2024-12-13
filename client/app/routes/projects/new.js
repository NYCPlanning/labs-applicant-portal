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

    /*
      We need to create a pseudo project id in order to enable document attachments within the new projects form.
      The actual project id will be assigned after the form is submitted to the CRM
     */
    projectsNewForm.id = `new${self.crypto.randomUUID()}`;
    projectsNewForm.createFileQueue();

    return projectsNewForm;
  }
}
