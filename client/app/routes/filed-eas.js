import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default class FiledEasRoute extends Route.extend(AuthenticatedRouteMixin) {
  authenticationRoute = '/';

  async model(params) {
    const filedEasPackage = await this.store.findRecord('package', params.id, {
      reload: true,
      include: 'project,ceqrInvoiceQuestionnaires',
    });

    // manually generate a file factory
    filedEasPackage.createFileQueue();

    filedEasPackage.project.createArtifactFileQueue();

    return filedEasPackage;
  }
}
