import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class ApplicantTeamEditorComponent extends Component {
  @service
  store;

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

    // FIXME: this updates the applicants array to update the UI
    // but if we do this save buttton becomes disabled and user can't save
    // because the way we compute pasForm.isApplicantsDirty is iterating through applicants array
    // and checking each applicant model for dirtiness -- if we remove this applicant here,
    // then it won't be included in the iteration and won't appear as dirty

    // this.args.applicants.popObject(applicant);
  }
}
