import Route from '@ember/routing/route';

export default class WorkingPackageRoute extends Route {
  authenticationRoute = '/';

  async model(params) {
    const rwcdsFormPackage = await this.store.findRecord('package', params.id, {
      reload: true,
    });

    // manually generate a file factory
    rwcdsFormPackage.createFileQueue();

    return rwcdsFormPackage;
  }
}
