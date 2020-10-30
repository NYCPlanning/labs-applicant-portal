import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default class ScopeOfWorkDraftRoute extends Route.extend(AuthenticatedRouteMixin) {
  authenticationRoute = '/';

  async model(params) {
    const scopeOfWorkDraftPackage = await this.store.findRecord('package', params.id, {
      reload: true,
      include: 'project',
    });

    // manually generate a file factory
    scopeOfWorkDraftPackage.createFileQueue();

    return scopeOfWorkDraftPackage;
  }
}
