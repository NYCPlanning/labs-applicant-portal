import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default class RwcdsFormRoute extends Route.extend(AuthenticatedRouteMixin) {
  authenticationRoute = '/';

  async model(params) {
    const rwcdsFormPackage = await this.store.findRecord('package', params.id, {
      reload: true,
      include: 'rwcds-form,project,rwcds-form.affectedZoningResolutions',
    });

    // manually generate a file factory
    rwcdsFormPackage.createFileQueue();

    rwcdsFormPackage.project.createArtifactFileQueue();

    return rwcdsFormPackage;
  }
}
