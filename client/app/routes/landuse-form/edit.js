import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default class LanduseFormEditRoute extends Route.extend(AuthenticatedRouteMixin) {
  @service router;

  afterModel(model) {
    const formpackage = model.package;
    const { landuseForm } = formpackage;
    const { landuseActions } = landuseForm;
    const projectDispositionCodes = ['HA', 'HD'];

    const luPackageActionCodes = landuseActions.currentState.map((landuseAction) => landuseAction.__recordData.__data.dcpActioncode);

    (function determineIfDispositionIsProposed() {
      if (luPackageActionCodes.some((luPackageActionCode) => projectDispositionCodes.includes(luPackageActionCode))) {
        return landuseForm.dcpDisposition = true;
      }
    }());
  }
}
