import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { bblBreakup } from '../../helpers/bbl-breakup';
import { BOROUGHS } from '../../optionsets/bbl';

// zap search provides bbls as 1-5-4 digits. the first part of the bbl,
// the borough, is represented as a number. this object maps those
// numbers to their respective CRM code.
const NUMERIC_BOROUGH_MAPPING = {
  1: BOROUGHS.MANHATTAN.code,
  2: BOROUGHS.BRONX.code,
  3: BOROUGHS.BROOKLYN.code,
  4: BOROUGHS.QUEENS.code,
  5: BOROUGHS.STATEN_ISLAND.code,
};

export default class ProjectGeographyComponent extends Component {
  @service
  store;

  @tracked bblAlreadyCreated = false;

  @tracked duplicateBblNumber = '';

  @action
  async selectSearchResult(labsSearchResult) {
    // `labsSearchResult` is object with `label` (address) and `bbl` attributes.
    // labsSearchResult.bbl comes back as a number,
    // whereas dcpBblnumber in CRM is stored as a string.
    const currentBbl = labsSearchResult.bbl.toString();

    const { borough, block, lot } = bblBreakup(currentBbl);

    // To avoid duplicate bbls
    const projectBbls = await this.store.findAll('bbl');
    const duplicateBbls = projectBbls.filter((bbl) => bbl.dcpBblnumber === currentBbl);

    if (duplicateBbls.length < 1) {
      this.bblAlreadyCreated = false;
      const bblObjectToPush = this.store.createRecord('bbl', {
        dcpBblnumber: currentBbl,
        dcpDevelopmentsite: null,
        dcpPartiallot: null,

        dcpUserinputborough: NUMERIC_BOROUGH_MAPPING[borough],
        dcpUserinputblock: block,
        dcpUserinputlot: lot,

        project: this.args.project,
      });

      // set local variables for displaying address next to bbl in bbls list
      const currentAddress = labsSearchResult.label;
      const formattedAddress = currentAddress.replace(', New York, NY, USA', '');
      bblObjectToPush.temporaryAddressLabel = formattedAddress;

      // use unshiftObect to push to TOP of array
      // this sorting is so that when a user adds a new bbl, the bbl does not appear at the
      // bottom of the screen where they will be unable to see it
      this.args.bbls.unshiftObject(bblObjectToPush);
    } else {
      this.bblAlreadyCreated = true;
      this.duplicateBblNumber = currentBbl;
    }
  }
}
