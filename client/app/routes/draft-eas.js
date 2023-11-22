import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class draftEasRoute extends Route {
  @service session;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');
  }


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
