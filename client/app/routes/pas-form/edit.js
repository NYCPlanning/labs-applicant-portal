import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { STATUSCODE, STATECODE } from 'client/optionsets/package';

export default class PasFormEditRoute extends Route.extend(AuthenticatedRouteMixin) {
  @service router;

  afterModel(model) {
    console.log(`PAS Package statuscode is ${model.statuscode} (${model.statuscode === 1 ? 'Package Preparation' : 'Submitted'}). The package status code of ${model.statuscode} ${model.statuscode === STATUSCODE.SUBMITTED.code ? 'is equal' : 'is not equal'} to the STATUSCODE SUBMITTED code of ${STATUSCODE.SUBMITTED.code}`);
    console.log(`PAS Package statecode is ${model.statecode} (${model.statuscode === 0 ? 'Active' : 'Inactive'}). The package state code of ${model.statecode} ${model.statecode === STATECODE.INACTIVE.code ? 'is equal' : 'is not equal'} to the STATECODE INACTIVE code of ${STATECODE.INACTIVE.code}.`);

    /*
      STATECODE.ACTIVE 0 = Active
      STATECODE.INACTIVE 1 = Inactive

      STATUSCODE.PACKAGE_PREPARATION 1 = Package Preparation
      STATUSCODE.SUBMITTED.code = 717170012
    */

    if (model.statuscode === STATUSCODE.SUBMITTED.code && model.statecode === STATECODE.INACTIVE.code) {
      return this.router.replaceWith('pas-form');
    }
  }
}
