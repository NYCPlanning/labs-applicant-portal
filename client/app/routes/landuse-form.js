import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import RSVP from 'rsvp';

export default class LanduseFormRoute extends Route.extend(AuthenticatedRouteMixin) {
  authenticationRoute = '/';

  async model(params) {
    const landuseFormPackage = await this.store.findRecord('package', params.id, {
      reload: true,
      include: [
        'landuse-form.bbls',
        'landuse-form.applicants',
        'project',
        'landuse-form.related-actions',
        'landuse-form.landuse-actions',
        'landuse-form.sitedatah-forms',
        'landuse-form.landuse-geographies',
        'landuse-form.lead-agency',
        'landuse-form.affected-zoning-resolutions',
      ].join(),
    });

    // manually generate a file factory
    landuseFormPackage.createFileQueue();

    return RSVP.hash({
      package: landuseFormPackage,
      accounts: await this.store.findAll('account'),
    });
  }
}
