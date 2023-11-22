import Component from '@glimmer/component';
import { action, get } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import SaveablePasFormValidations from '../../../validations/saveable-pas-form';
import SubmittablePasFormValidations from '../../../validations/submittable-pas-form';

import SaveableApplicantFormValidations from '../../../validations/saveable-applicant-form';
import SubmittableApplicantFormValidations from '../../../validations/submittable-applicant-form';

import SubmittablePackageFormValidations from '../../../validations/submittable-package';

import { addToHasMany, removeFromHasMany } from '../../../utils/ember-changeset';

export default class PasFormComponent extends Component {
  validations = {
    SaveablePasFormValidations,
    SubmittablePasFormValidations,
    SaveableApplicantFormValidations,
    SubmittableApplicantFormValidations,

    SubmittablePackageFormValidations,
  };

  @tracked
  recordsToDelete = [];

  @service
  router;

  @service
  store;

  get package() {
    console.log(" we are here getting package");
    console.log("getting package", this.args.package ? this.args.package : "failed getting package");

    return this.args.package || {};
  }

  get pasForm() {
    console.log(" we are here getting rwcds form");
    console.log("getting PAS form", this.package.pasForm ? this.package.pasForm : "failed getting PAS form");
    return this.package.pasForm || {};
  }

  get packageIsDirtyOrRecordsDeleted() {
    console.log(" we are here getting packageIsDirtyOrRecordsDeleted");
    return this.package.isDirty || this.recordsToDelete.length > 0;
  }

  @action
  async savePackage() {
    try {
      console.log("saving package", this.args.package ? this.args.package : "no package to save");
      console.log("saving package", this.recordsToDelete ? this.recordsToDelete : "no records to delete");
      await this.args.package.save(this.recordsToDelete);
      this.recordsToDelete = [];
    } catch (error) {
      console.log('Save PAS package error:', error);
    }
  }

  @action
  async submitPackage() {
    await this.args.package.submit();

    if (!this.pasForm.adapterError && !this.package.adapterError && !this.package.fileUploadErrors) {
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
