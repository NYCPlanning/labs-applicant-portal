import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import RSVP from 'rsvp';

export default class ProjectFormRoute extends Route.extend(AuthenticatedRouteMixin) {
    authenticationRoute = '/';

    async model(params) {
        const projectFormPackage = await this.store.createRecord('project-form')

        return RSVP.hash({
            package: projectFormPackage
        })
    }
}
