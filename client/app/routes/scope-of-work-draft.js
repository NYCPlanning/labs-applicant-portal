import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ScopeOfWorkDraftRoute extends Route {
  @service session;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');
  }

  async model(params) {
    const scopeOfWorkDraftPackage = await this.store.findRecord('package', params.id, {
      reload: true,
      include: 'project,ceqrInvoiceQuestionnaires',
    });

    // manually generate a file factory
    scopeOfWorkDraftPackage.createFileQueue();

    return scopeOfWorkDraftPackage;
  }
}
