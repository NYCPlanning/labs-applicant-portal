import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default class LanduseFormRoute extends Route.extend(AuthenticatedRouteMixin) {
  authenticationRoute = '/';

  async model(params) {
    const landuseFormPackage = await this.store.findRecord('package', params.id, {
      reload: true,
      include: 'landuse-form.bbls,landuse-form.applicants,project,landuse-form.related-actions',
    });

    // manually generate a file factory
    landuseFormPackage.createFileQueue();

    return landuseFormPackage;
  }
}
