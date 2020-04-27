import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ApplicantTeamEditorComponent extends Component {
  @action
  addApplicant(title) {
    console.log(this.args.applicants);
    this.args.applicants.pushObject({ title });
  }

  // TODO: figure out how to delete this object
  @action removeApplicant(applicant) {
    console.log(`REMOVE APPLICANT:  ${applicant}`) // logs "REMOVE APPLICANT:  model:applicant(:id)"
  }
}