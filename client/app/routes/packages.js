import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default class PackagesRoute extends Route.extend(AuthenticatedRouteMixin) {
  authenticationRoute = '/';

  async model(params) {
    const projectPackage = await this.store.findRecord('package', params.id, {
      reload: true,
      include: 'pas-form.bbls,project',
    });

    // manually generate a file factory
    projectPackage.createFileQueue();

    return projectPackage;
  }
}
