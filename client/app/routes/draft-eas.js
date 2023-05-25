import Route from '@ember/routing/route';
// eslint-disable-next-line ember/no-mixins
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default class draftEasRoute extends Route.extend(
  AuthenticatedRouteMixin,
) {
  authenticationRoute = '/';

  async model(params) {
    const draftEasPackage = await this.store.findRecord('package', params.id, {
      reload: true,
      include: 'project',
    });

    // manually generate a file factory
    draftEasPackage.createFileQueue();

    return draftEasPackage;
  }
}
