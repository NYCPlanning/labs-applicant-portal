import Route from '@ember/routing/route';
// eslint-disable-next-line ember/no-mixins
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default class PasFormRoute extends Route.extend(
  AuthenticatedRouteMixin,
) {
  authenticationRoute = '/';

  async model(params) {
    const pasFormPackage = await this.store.findRecord('package', params.id, {
      reload: true,
      include:
        'pas-form.bbls,pas-form.applicants,pas-form.project-addresses,project.artifact',
    });

    // manually generate a file factory
    pasFormPackage.createFileQueue();

    return pasFormPackage;
  }
}
