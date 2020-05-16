import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default class PackagesRoute extends Route.extend(AuthenticatedRouteMixin) {
  authenticationRoute = '/';

  model(params) {
    return this.store.findRecord('package', params.id, {
      reload: true,
      include: 'pasForm,project',
    });
  }
}
