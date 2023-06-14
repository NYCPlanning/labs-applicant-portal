import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class LanduseFormEditRoute extends Route {
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
