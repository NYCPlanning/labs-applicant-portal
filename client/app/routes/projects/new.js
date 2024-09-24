import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default class ProjectsNewRoute extends Route.extend(AuthenticatedRouteMixin) {
  @service store;

  async model() {
    return await this.store.createRecord('project');
  }
}
