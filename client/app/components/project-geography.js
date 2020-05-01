import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class ProjectGeographyComponent extends Component {
  @service
  store;

  // represents array of bbl models
  @tracked bbls;

  // TODO: ISSUE #110
  // Used to find corresponding addresses for list of bbls.
  // Populated later with labs-search addon response.
  // bblToAddressLookup = {};

  @action
  selectSearchResult(labsSearchResult) {
    // `labsSearchResult` is object with `label` (address) and `bbl` attributes.
    // labsSearchResult.bbl comes back as a number,
    // whereas dcpBblnumber in CRM is stored as a string.
    const bblObjectToPush = this.store.createRecord('bbl', {
      dcpBblnumber: labsSearchResult.bbl.toString(),
      dcpDevelopmentsite: null,
      dcpPartiallot: null,
    });

    // TODO: ISSUE #110
    // set local variables for displaying address next to bbl in list
    // const currentAddress = labsSearchResult.label;
    // const formattedAddress = currentAddress.replace(', New York, NY, USA', '');
    // this.bblToAddressLookup[currentBbl] = formattedAddress;

    // use unshiftObect to push to TOP of array
    // this sorting is so that when a user adds a new bbl, the bbl does not appear at the
    // bottom of the screen where they will be unable to see it
    this.args.bbls.unshiftObject(bblObjectToPush);
  }

  // Remove bbl object from list of bbls
  @action
  removeBbl(bblObjectToBeRemoved) {
    this.store.deleteRecord(bblObjectToBeRemoved);
    this.args.bbls.removeObject(bblObjectToBeRemoved);
  }

  // Update attributes when user selects radio buttons
  @action
  updateAttr(currentObject, attr, newVal) {
    currentObject[attr] = newVal;
  }
}
