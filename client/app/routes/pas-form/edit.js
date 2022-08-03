import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { STATUSCODE, STATECODE } from 'client/optionsets/package';

export default class PasFormEditRoute extends Route.extend(AuthenticatedRouteMixin) {
  @service router;

  afterModel(model) {
    if (model.statuscode === STATUSCODE.SUBMITTED.code && model.statecode === STATECODE.INACTIVE.code) {
      return this.router.replaceWith('pas-form');
    }
  }
}
