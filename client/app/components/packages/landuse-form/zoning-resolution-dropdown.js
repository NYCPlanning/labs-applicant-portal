import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class PackagesLanduseFormZoningResolutionComponent extends Component {
  @tracked chosenZoningResolutionName;

  get zoningResolutionNames() {
    console.log('this.args.zoningResolutions', this.args.zoningResolutions);
    if (this.args.zoningResolutions) {
      return this.args.zoningResolutions.map((zr) => zr.dcpZoningresolution);
    } return [];
  }

  // get searchPlaceholder() {
  //   if (this.args.landuseForm.data.landuseAction.zoningResolution) {
  //     return this.args.landuseForm.data.landuseAction.zoningResolution.name;
  //   } return 'Search Zoning Resolution Sections...';
  // }

  get chosenZoningResolutionId() {
    const zoningResolution = this.args.zoningResolutions.find((zr) => zr.name === this.chosenZoningResolutionName);
    return zoningResolution.id;
  }
}
