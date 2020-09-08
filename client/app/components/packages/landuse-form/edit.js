import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
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

  @service
  store;

  get package() {
    return this.args.package || {};
  }

  get landuseForm() {
    return this.package.landuseForm || {};
  }

  @action
  async savePackage() {
    try {
      await this.args.package.save();
    } catch (error) {
      console.log('Save Landuse package error:', error);
    }
  }

  @action
  async submitPackage() {
    await this.args.package.submit();

    this.router.transitionTo('land-use.show', this.args.package.id);
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

    relatedAction.deleteRecord();
  }
}
