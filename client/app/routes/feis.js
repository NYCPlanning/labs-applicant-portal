import Route from '@ember/routing/route';
// eslint-disable-next-line ember/no-mixins
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default class FeisRoute extends Route.extend(AuthenticatedRouteMixin) {
  authenticationRoute = '/';

  async model(params) {
    const feisPackage = await this.store.findRecord('package', params.id, {
      reload: true,
      include: 'project',
    });

    // manually generate a file factory
    feisPackage.createFileQueue();

    return feisPackage;
  }
}
