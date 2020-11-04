import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default class ProjectRoute extends Route.extend(AuthenticatedRouteMixin) {
  authenticationRoute = '/';

  async model(params) {
    return this.store.findRecord('project', params.id, {
      reload: true,
      include: 'packages.pasForm,packages.rwcdsForm,packages.landuseForm,projectApplicants.contacts,teamMembers',
      ...params,
    });
  }
}
