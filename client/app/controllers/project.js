import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { optionset } from '../helpers/optionset';
import { STATECODE, STATUSCODE } from '../optionsets/contact';
import ENV from '../config/environment';

export default class ProjectController extends Controller {
  @tracked contactMgmtOpen = false;

  @tracked addEditorModalOpen;

  @tracked emailAddress;

  @tracked firstName;

  @tracked lastName;

  contactMgmtEnabled = ENV.APP.contactMgmtEnabled;

  @service
  store;

  get matchingCurrentApplicant() {
    const currentApplicants = this.project.projectApplicants;
    return currentApplicants.find((applicant) => applicant.emailaddress === this.emailAddress);
  }

  @action
  toggleContactMgmt() {
    this.contactMgmtOpen = !this.contactMgmtOpen;
  }

  @action
  addEditor() {
    this.addEditorModalOpen = true;
  }

  @action
  removeEditor(applicant) {
    applicant.destroyRecord();
  }

  get contactActiveStatusCode() {
    return STATUSCODE.ACTIVE.code;
  }

  get contactActiveStateCode() {
    return STATECODE.ACTIVE.code;
  }

  @action
  async saveEditor() {
    this.addEditorModalOpen = false;
    if (!this.matchingCurrentApplicant) {
      const newApplicant = await this.store.createRecord('project-applicant', {
        dcpName: `${this.firstName} ${this.lastName}`,
        firstname: this.firstName,
        lastname: this.lastName,
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
