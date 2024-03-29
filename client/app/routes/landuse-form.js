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
        'project.artifact',
        'landuse-form.related-actions',
        'landuse-form.landuse-actions',
        'landuse-form.sitedatah-forms',
        'landuse-form.landuse-geographies',
        'landuse-form.lead-agency',
        'landuse-form.affected-zoning-resolutions',
        'landuse-form.landuse-actions.zoning-resolution',
      ].join(),
    });

    // manually generate a file factory
    landuseFormPackage.createFileQueue();

    landuseFormPackage.project.artifact.createFileQueue();

    return RSVP.hash({
      package: landuseFormPackage,
      accounts: await this.store.findAll('account'),
      zoningResolutions: await this.store.findAll('zoning-resolution'),
    });
  }
}
