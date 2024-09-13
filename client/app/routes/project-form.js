import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import RSVP from 'rsvp';

export default class ProjectFormRoute extends Route.extend(AuthenticatedRouteMixin) {
    authenticationRoute = '/';

    async model(params) {
        const projectFormPackage = await this.store.findRecord('package', params.id, {
            reload: true,
            include: [
                'project.artifact'
            ].join(),
        })

        return RSVP.hash({
            package: projectFormPackage
        })
    }
}
