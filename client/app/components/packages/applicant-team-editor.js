import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class ApplicantTeamEditorComponent extends Component {
  @service
  store;

  get displayApplicants() {
    return this.args.applicants.filter((applicant) => !applicant.isDeleted);
  }

  // allow a user to add a new applicant fieldset
  @action
  addApplicant(targetEntity) {
    // create a new applicant record in store
    const newApplicant = this.store.createRecord('applicant', { targetEntity });

    // add the record to the array managing the editor's UI
    this.args.applicants.pushObject(newApplicant);
  }

  // allow a user to remove an applicant fieldset
  @action
  removeApplicant(applicant) {
    applicant.deleteRecord();
  }
}
