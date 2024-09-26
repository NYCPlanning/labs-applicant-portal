import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default class ProjectsNewRoute extends Route.extend(AuthenticatedRouteMixin) {
    authenticationRoute = '/';

    // static createProjectNewRecord = this.store.createRecord('project-new');

    async model() {
      return await this.store.createRecord('project-new');
    //   return this.createProjectNewRecord;
    // return {
    //     dcpProjectName: "set in the route"
    // }
    }
}
