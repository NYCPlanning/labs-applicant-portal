import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class DeisRoute extends Route {
  @service session;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');
  }


  async model(params) {
    const deisPackage = await this.store.findRecord('package', params.id, {
      reload: true,
      include: 'project',
    });

    // manually generate a file factory
    deisPackage.createFileQueue();

    return deisPackage;
  }
}
