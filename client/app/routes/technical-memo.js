import Route from '@ember/routing/route';
// eslint-disable-next-line ember/no-mixins
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default class TechnicalMemoRoute extends Route.extend(
  AuthenticatedRouteMixin,
) {
  authenticationRoute = '/';

  async model(params) {
    const tehnicalMemoPackage = await this.store.findRecord(
      'package',
      params.id,
      {
        reload: true,
        include: 'project',
      },
    );

    // manually generate a file factory
    tehnicalMemoPackage.createFileQueue();

    return tehnicalMemoPackage;
  }
}
