import Route from '@ember/routing/route';
import { inject as service } from "@ember/service";

export default class ProjectsNewRoute extends Route {
  @service store;

  async model() {
    return this.store.createRecord('projects');
  }
}
