import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class PackagesLanduseFormZoningResolutionComponent extends Component {
  @tracked chosenZoningResolution;

  get searchPlaceholder() {
    if (this.args.landuseActionForm.data.zoningResolution) {
      return this.args.landuseActionForm.data.zoningResolution.dcpZoningresolution;
    } return 'Search Zoning Resolution Sections...';
  }
}
