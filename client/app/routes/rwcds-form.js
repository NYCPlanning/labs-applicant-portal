import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class RwcdsFormRoute extends Route {
  @service session;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');
  }

  async model(params) {
    const rwcdsFormPackage = await this.store.findRecord('package', params.id, {
      reload: true,
      include: 'rwcds-form,project,rwcds-form.affectedZoningResolutions',
    });

    // manually generate a file factory
    rwcdsFormPackage.createFileQueue();

    return rwcdsFormPackage;
  }
}
