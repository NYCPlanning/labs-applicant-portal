import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import SaveableProjectFormValidations from '../../../validations/saveable-project-form';
import SubmittableProjectFormValidations from '../../../validations/submittable-project-form';
import SaveableLanduseFormValidations from '../../../validations/saveable-landuse-form';
import SubmittableLanduseFormValidations from '../../../validations/submittable-landuse-form';
import SaveableApplicantFormValidations from '../../../validations/saveable-applicant-form';
import SubmittableApplicantFormValidations from '../../../validations/submittable-applicant-form';
import SaveableRelatedActionFormValidations from '../../../validations/saveable-related-action-form';
import SubmittableRelatedActionFormValidations from '../../../validations/submittable-related-action-form';
import { addToHasMany, removeFromHasMany } from '../../../utils/ember-changeset';

export default class LandUseFormComponent extends Component {
  validations = {
    SaveableProjectFormValidations,
    SubmittableProjectFormValidations,
    SaveableLanduseFormValidations,
    SubmittableLanduseFormValidations,
    SaveableApplicantFormValidations,
    SubmittableApplicantFormValidations,
    SaveableRelatedActionFormValidations,
    SubmittableRelatedActionFormValidations,
  };

  @tracked recordsToDelete = [];

  @service
  router;

  @service
  store;

  get package() {
    return this.args.package || {};
  }

  get landuseForm() {
    return this.package.landuseForm || {};
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
      console.log('Save Landuse package error:', error);
    }
  }

  @action
  async submitPackage() {
    await this.args.package.submit();

    this.router.transitionTo('landuse-form.show', this.args.package.id);
  }

  @action
  addApplicant(targetEntity, changeset) {
    const newApplicant = this.store.createRecord('applicant', {
      targetEntity, // distinguishes between different applicant types for the backend
      landuseForm: this.landuseForm,
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
  addRelatedAction(changeset) {
    const newRelatedAction = this.store.createRecord('related-action', {
      landuseForm: this.landuseForm,
    });

    addToHasMany(changeset, 'relatedActions', newRelatedAction);
  }

  @action
  removeRelatedAction(relatedAction, changeset) {
    removeFromHasMany(changeset, 'relatedActions', relatedAction);

    this.recordsToDelete.push(relatedAction);

    relatedAction.deleteRecord();
  }

  @action
  removeBbl(bbl) {
    bbl.deleteRecord();
    this.recordsToDelete.push(bbl);
    this.args.package.landuseForm.bbls.removeObject(bbl);
  }
}
