import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { action } from '@ember/object';

export default class PackagesRoute extends Route.extend(AuthenticatedRouteMixin) {
  authenticationRoute = '/';

  async model(params) {
    console.log('params.id', params.id);
    const projectPackage = await this.store.findRecord('package', params.id, {
      reload: true,
      include: 'pas-form.bbls,project',
    });

    // manually generate a file factory
    projectPackage.createFileQueue();

    return projectPackage;
  }

  @action
  refreshModel() {
    console.log('are we hitting you though?');
    this.refresh();
  }
}
