import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ProjectRoute extends Route {
  @service session;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');
  }

  async model(params) {
    return this.store.findRecord('project', params.id, {
      reload: true,
      include: 'packages.pasForm,packages.rwcdsForm,packages.landuseForm,projectApplicants.contacts,teamMembers',
      ...params,
    });
  }
}
