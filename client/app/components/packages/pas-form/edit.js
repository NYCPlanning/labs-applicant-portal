import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { Changeset } from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import SaveablePasFormValidations from '../../../validations/saveable-pas-form';
import SubmittablePasFormValidations from '../../../validations/submittable-pas-form';

// 1. attempting to extract changes, invalid or valid, breaks
//   the save button disabled/enabled
// 2. error messages don't appear or disappear when circumenvting the changeset

export default class PasFormComponent extends Component {
  constructor(...args) {
    super(...args);

    this.saveableChanges = new Changeset(
      this.pasForm,
      lookupValidator(SaveablePasFormValidations),
      SaveablePasFormValidations,
    );

    const submittableChangeset = new Changeset(
      this.pasForm,
      lookupValidator(SubmittablePasFormValidations),
      SubmittablePasFormValidations,
    );

    this.submittableChanges = this.saveableChanges.merge(submittableChangeset);
  }

  @service router;

  @tracked modalIsOpen = false;

  get package() {
    return this.args.package || {};
  }

  get pasForm() {
    return this.package.pasForm || {};
  }

  get isSaveable() {
    const { isDirty: isPasFormDirty } = this.saveableChanges;
    const {
      isBblsDirty,
      isApplicantsDirty,
    } = this.pasForm;

    return isPasFormDirty || isBblsDirty || isApplicantsDirty;
  }

  get isSubmittable() {
    return this.submittableChanges.isValid;
  }

  // TODO: consider decoupling the PAS Form from the Package
  // for better modularity and avoiding "inappropriate intimacy"
  @action
  async save() {
    await this.saveableChanges.save();
    await this.package.saveDescendants();
  }

  @action
  async submit() {
    await this.submittableChanges.save();
    await this.package.saveDescendants();

    this.router.transitionTo('packages.show', this.pasForm.id);
  }

  @action
  updateAttr(obj, attr, newVal) {
    obj[attr] = newVal;
  }

  @action
  toggleModal() {
    this.modalIsOpen = !this.modalIsOpen;
  }
}
