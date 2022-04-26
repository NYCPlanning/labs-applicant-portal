import Route from '@ember/routing/route';

export default class WorkingPackageRoute extends Route {
  authenticationRoute = '/';

  async model(params) {
    const workingPackage = await this.store.findRecord('package', params.id, {
      reload: true,
    });

    // manually generate a file factory
    workingPackage.createFileQueue();

    workingPackage.project.createArtifactFileQueue();

    return workingPackage;
  }
}
