import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { STATECODE, STATUSCODE } from '../optionsets/contact';

export default class ContactManagerComponent extends Component {
  @service
  store;

  @tracked contactMgmtOpen = false;

  @tracked addEditorModalOpen;

  @tracked emailAddress;

  @tracked firstName;

  @tracked lastName;

  @tracked contact;

  get matchingCurrentApplicant() {
    return this.args.projectApplicants.find(
      (applicant) => applicant.email === this.emailAddress,
    );
  }

  @action
  toggleContactMgmt() {
    this.contactMgmtOpen = !this.contactMgmtOpen;
  }

  @action
  async addEditor() {
    this.addEditorModalOpen = true;
    const { emailAddress } = this;

    this.contact = await this.store.queryRecord('contact', {
      email: emailAddress,
    });
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
  async save() {
    this.addEditorModalOpen = false;

    if (!this.matchingCurrentApplicant) {
      await this.args.save({
        firstName: this.firstName,
        lastName: this.lastName,
        emailAddress: this.emailAddress,
      });
    }

    this.firstName = '';
    this.lastName = '';
    this.emailAddress = '';
  }
}
