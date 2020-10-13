import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class PackagesLanduseFormZoningResolutionComponent extends Component {
  @tracked chosenZoningResolutionName;

  get zoningResolutionNames() {
    if (this.args.zoningResolutions) {
      return this.args.zoningResolutions.map((zr) => zr.dcpZoningresolution);
    } return [];
  }

  get searchPlaceholder() {
    if (this.args.landuseActionForm.data.zoningResolution) {
      return this.args.landuseActionForm.data.zoningResolution.dcpZoningresolution;
    } return 'Search Zoning Resolution Sections...';
  }

  get chosenZoningResolutionId() {
    if (this.chosenZoningResolutionName) {
      const zoningResolution = this.args.zoningResolutions.find((zr) => zr.dcpZoningresolution === this.chosenZoningResolutionName);
      return zoningResolution.id;
    }
  }
}
