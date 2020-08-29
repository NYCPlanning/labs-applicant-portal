import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { optionset } from '../helpers/optionset';

export default class ProjectController extends Controller {
  @tracked modalOpen;

  @tracked emailAddress;

  @tracked firstName;

  @tracked lastName;

  @service
  store;

  get matchingCurrentApplicant() {
    const currentApplicants = this.project.projectApplicants;
    return currentApplicants.find((applicant) => applicant.emailaddress === this.emailAddress);
  }

  @action
  addEditor() {
    this.modalOpen = true;
  }

  @action
  removeEditor(applicant) {
    applicant.destroyRecord();
  }

  @action
  async saveEditor() {
    this.modalOpen = false;
    if (!this.matchingCurrentApplicant) {
      const newApplicant = await this.store.createRecord('project-applicant', {
        dcpName: `${this.firstName} ${this.lastName}`,
        emailaddress: this.emailAddress,
        dcpApplicantrole: optionset(['projectApplicant', 'applicantrole', 'code', 'Other']),
        project: this.project,
      });
      await newApplicant.save();
    }
    this.firstName = '';
    this.lastName = '';
    this.emailAddress = '';
  }
}
