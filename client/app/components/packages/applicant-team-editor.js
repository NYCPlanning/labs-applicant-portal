import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ApplicantTeamEditorComponent extends Component {
  @service
  store;

  // allow a user to add a new applicant fieldset
  @action
  addApplicant(role) {
    // create a new applicant record in store
    const newApplicant = this.store.createRecord('applicant', {role});

    // add the record to the array managing the editor's UI
    this.args.applicants.pushObject(newApplicant);
  }

  // allow a user to remove an applicant fieldset
  @action removeApplicant(applicant) {
    // remove the applicant from the ember store
    this.store.deleteRecord(applicant);

    // remove the DOM node by removing the object from the array passed to the editor component
    this.args.applicants.removeObject(applicant);
  }
}