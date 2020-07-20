import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import SaveablePasFormValidations from '../../../validations/saveable-pas-form';
import SubmittablePasFormValidations from '../../../validations/submittable-pas-form';

import SaveableApplicantFormValidations from '../../../validations/saveable-applicant-form';
import SubmittableApplicantFormValidations from '../../../validations/submittable-applicant-form';

import { addToHasMany, removeFromHasMany } from '../../../utils/ember-changeset';

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

  @action
  async savePackage() {
    try {
      await this.args.package.save();
      await this.args.package.reload();
    } catch (error) {
      console.log('Save PAS package error:', error);
    }

    this.args.package.refreshExistingDocuments();
  }

  @action
  async submitPackage() {
    await this.args.package.submit();

    this.router.transitionTo('pas-form.show', this.args.package.id);
  }

  @action
  addApplicant(targetEntity, changeset) {
    const newApplicant = this.store.createRecord('applicant', {
      targetEntity, // distinguishes between different applicant types for the backend
      pasForm: this.pasForm,
    });

    addToHasMany(changeset, 'applicants', newApplicant);
  }

  @action
  removeApplicant(applicant, changeset) {
    removeFromHasMany(changeset, 'applicants', applicant);

    applicant.deleteRecord();
  }
}
