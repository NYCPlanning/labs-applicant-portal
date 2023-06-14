import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class PasFormRoute extends Route {
  @service session;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');
  }

  async model(params) {
    const pasFormPackage = await this.store.findRecord('package', params.id, {
      reload: true,
      include: 'pas-form.bbls,pas-form.applicants,pas-form.project-addresses,project.artifact',
    });

    // manually generate a file factory
    pasFormPackage.createFileQueue();

    return pasFormPackage;
  }
}
