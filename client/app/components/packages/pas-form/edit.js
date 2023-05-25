import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import SaveablePasFormValidations from '../../../validations/saveable-pas-form';
import SubmittablePasFormValidations from '../../../validations/submittable-pas-form';

import SaveableApplicantFormValidations from '../../../validations/saveable-applicant-form';
import SubmittableApplicantFormValidations from '../../../validations/submittable-applicant-form';

import SubmittablePackageFormValidations from '../../../validations/submittable-package';

import {
  addToHasMany,
  removeFromHasMany,
} from '../../../utils/ember-changeset';

export default class PasFormComponent extends Component {
  validations = {
    SaveablePasFormValidations,
    SubmittablePasFormValidations,
    SaveableApplicantFormValidations,
    SubmittableApplicantFormValidations,

    SubmittablePackageFormValidations,
  };

  @tracked recordsToDelete = [];

  @service
  router;

  @service
  store;

  get package() {
    console.log(" this.args.package || {};",  this.args.package || {});
    return this.args.package || {};
  }

  get pasForm() {
    return this.package.pasForm || {};
  }

  get packageIsDirtyOrRecordsDeleted() {
    return this.package.isDirty || this.recordsToDelete.length > 0;
  }

  @action
  async savePackage() {
    try {
      await this.args.package.save(this.recordsToDelete);
      this.recordsToDelete = [];
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('Save PAS package error:', error);
    }
  }

  @action
  async submitPackage() {
    await this.args.package.submit();

    if (
      !this.pasForm.adapterError
      && !this.package.adapterError
      && !this.package.fileUploadErrors
    ) {
      this.router.transitionTo('pas-form.show', this.args.package.id);
    }
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

    this.recordsToDelete.push(applicant);

    applicant.deleteRecord();
  }

  @action
  removeBbl(bbl) {
    bbl.deleteRecord();
    this.recordsToDelete.push(bbl);
    this.args.package.pasForm.bbls.removeObject(bbl);
  }
}
