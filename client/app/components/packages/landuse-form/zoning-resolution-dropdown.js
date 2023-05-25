import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class PackagesLanduseFormZoningResolutionComponent extends Component {
  @tracked chosenZoningResolution =
    this.args.landuseActionForm.data.zoningResolution || null;

  @action
  clearDropdown(landuseActionFormData) {
    this.chosenZoningResolution = null;
    landuseActionFormData.zoningResolution = null;
    landuseActionFormData.chosenZoningResolutionId = null;
  }
}
