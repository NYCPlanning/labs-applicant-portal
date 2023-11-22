import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { STATUSCODE, STATECODE } from 'client/optionsets/package';

export default class PasFormEditRoute extends Route {
  @service router;

  afterModel(model) {
    if (model.statuscode === STATUSCODE.SUBMITTED.code && model.statecode === STATECODE.INACTIVE.code) {
      return this.router.replaceWith('pas-form');
    }
  }
}
