import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ProjectGeographyComponent extends Component {
  // represents the pasForm model
  @tracked pasForm;

  @action
  selectSearchResult(result) {
    // object that mimicks the objects that exist in the bbls array
    // of the pasForm (expand entity: dcp_dcp_projectbbl_dcp_pasform)
    // bblObjectToPush will be pushed into bbls array of pasForm
    const bblObjectToPush = {
      dcp_validatedlot: '',
      dcp_bblnumber: '',
      versionnumber: '',
      dcp_partiallot: null,
      dcp_developmentsite: null,
    };

    // set bblToAdd to the search result's bbl value
    // result.bbl comes back as a number
    // dcp_bblnumber in CRM is stored as a string
    const bblToAdd = result.bbl.toString();

    // update the dcp_bblnumber attribute to the user-entered value
    bblObjectToPush.dcp_bblnumber = bblToAdd;

    // push the updated bbl object into the bbls array of the pasForm
    this.args.pasForm.bbls.pushObject(bblObjectToPush);
  }

  @action
  removeBbl(bblObjectToBeRemoved) {
    // remove bbl object from list of bbls
    this.args.pasForm.bbls.removeObject(bblObjectToBeRemoved);
  }
}
