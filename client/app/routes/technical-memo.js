import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class TechnicalMemoRoute extends Route {
  @service session;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');
  }

  async model(params) {
    const tehnicalMemoPackage = await this.store.findRecord('package', params.id, {
      reload: true,
      include: 'project',
    });

    // manually generate a file factory
    tehnicalMemoPackage.createFileQueue();

    return tehnicalMemoPackage;
  }
}
