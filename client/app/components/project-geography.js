import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { bblBreakup } from '../helpers/bbl-breakup';
import { PROJECT_BBL_BOROUGHS } from '../models/bbl';

// zap search provides bbls as 1-5-4 digits. the first part of the bbl,
// the borough, is represented as a number. this object maps those
// numbers to their respective CRM code.
const NUMERIC_BOROUGH_MAPPING = {
  1: PROJECT_BBL_BOROUGHS.MANHATTAN.code,
  2: PROJECT_BBL_BOROUGHS.BRONX.code,
  3: PROJECT_BBL_BOROUGHS.BROOKLYN.code,
  4: PROJECT_BBL_BOROUGHS.QUEENS.code,
  5: PROJECT_BBL_BOROUGHS.STATEN_ISLAND.code,
};

export default class ProjectGeographyComponent extends Component {
  @service
  store;

  // represents array of bbl models
  @tracked bbls;

  @action
  selectSearchResult(labsSearchResult) {
    // `labsSearchResult` is object with `label` (address) and `bbl` attributes.
    // labsSearchResult.bbl comes back as a number,
    // whereas dcpBblnumber in CRM is stored as a string.
    const currentBbl = labsSearchResult.bbl.toString();

    const { borough, block, lot } = bblBreakup(currentBbl);

    const bblObjectToPush = this.store.createRecord('bbl', {
      dcpBblnumber: currentBbl,
      dcpDevelopmentsite: null,
      dcpPartiallot: null,

      dcpUserinputborough: NUMERIC_BOROUGH_MAPPING[borough],
      dcpUserinputblock: block,
      dcpUserinputlot: lot,
    });

    // set local variables for displaying address next to bbl in bbls list
    const currentAddress = labsSearchResult.label;
    const formattedAddress = currentAddress.replace(', New York, NY, USA', '');
    bblObjectToPush.temporaryAddressLabel = formattedAddress;

    // use unshiftObect to push to TOP of array
    // this sorting is so that when a user adds a new bbl, the bbl does not appear at the
    // bottom of the screen where they will be unable to see it
    this.args.bbls.unshiftObject(bblObjectToPush);
  }

  // Remove bbl object from list of bbls
  @action
  removeBbl(bblObjectToBeRemoved) {
    // this.store.deleteRecord(bblObjectToBeRemoved);
    bblObjectToBeRemoved.destroyRecord();
    this.args.bbls.removeObject(bblObjectToBeRemoved);
  }
}
