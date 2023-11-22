import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class WorkingPackageRoute extends Route {
  @service session;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');
  }

  async model(params) {
    const workingPackage = await this.store.findRecord('package', params.id, {
      reload: true,
    });

    // manually generate a file factory
    workingPackage.createFileQueue();

    return workingPackage;
  }
}
