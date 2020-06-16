import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import SaveablePasFormValidations from '../../../validations/saveable-pas-form';
import SubmittablePasFormValidations from '../../../validations/submittable-pas-form';

import SaveableApplicantFormValidations from '../../../validations/saveable-applicant-form';
import SubmittableApplicantFormValidations from '../../../validations/submittable-applicant-form';

export default class PasFormComponent extends Component {
  validations = {
    SaveablePasFormValidations,
    SubmittablePasFormValidations,
    SaveableApplicantFormValidations,
    SubmittableApplicantFormValidations,
  };

  @service
  router;

  @service
  store;

  get package() {
    return this.args.package || {};
  }

  get pasForm() {
    return this.package.pasForm || {};
  }

  @tracked modalIsOpen = false;

  @action
  toggleModal() {
    this.modalIsOpen = !this.modalIsOpen;
  }

  @action
  async savePackage() {
    try {
      await this.args.package.save();
      await this.args.package.reload();
    } catch (error) {
      console.log('Save package error:', error);
    }

    this.args.package.refreshExistingDocuments();
  }

  @action
  async submitPackage() {
    await this.args.package.submit();

    this.router.transitionTo('pas-form.show', this.args.package.id);
  }

  @action
  addApplicant(targetEntity) {
    this.store.createRecord('applicant', {
      targetEntity, // distinguishes between different applicant types for the backend
      pasForm: this.pasForm,
    });
  }

  @action
  removeApplicant(applicant) {
    applicant.deleteRecord();
  }
}
