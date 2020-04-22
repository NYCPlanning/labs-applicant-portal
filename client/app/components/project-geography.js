import Component from '@glimmer/component';
import EmberObject, { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

const bblObject = EmberObject.extend({
  dcp_validatedlot: '',
  dcp_bblnumber: '',
  versionnumber: '',
  dcp_partiallot: null,
  dcp_developmentsite: null,
});

export default class ProjectGeographyComponent extends Component {
  // object that mimicks the objects that exist in the bbls array
  // of the pasForm (expand entity: dcp_dcp_projectbbl_dcp_pasform)
  bblObject = bblObject.create();

  // user-entered bbl number
  @tracked bblNumberToAdd = '';

  // represents the pasForm model
  @tracked pasForm;

  @action
  async addBbl(bblNumber) {
    // bblObjectToPush will be pushed into bbls array of pasForm
    const bblObjectToPush = this.bblObject;

    // update the dcp_bblnumber attribute to the user-entered value
    bblObjectToPush.dcp_bblnumber = bblNumber.toString();

    // push the updated bbl object into the bbls array of the pasForm
    this.args.pasForm.bbls.pushObject(bblObjectToPush);
  }

  @action
  removeBbl(bblObjectToBeRemoved) {
    // remove bbl object from list of bbls
    this.args.pasForm.bbls.removeObject(bblObjectToBeRemoved);
  }
}
