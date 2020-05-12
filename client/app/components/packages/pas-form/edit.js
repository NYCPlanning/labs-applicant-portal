import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { Changeset } from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import SaveablePasFormValidations from '../../../validations/saveable-pas-form';
import SubmittablePasFormValidations from '../../../validations/submittable-pas-form';

export default class PasFormComponent extends Component {
  constructor(...args) {
    super(...args);

    this.saveableChanges = new Changeset(
      this.pasForm,
      lookupValidator(SaveablePasFormValidations),
      SaveablePasFormValidations,
    );

    this.submittableChanges = new Changeset(
      this.pasForm,
      lookupValidator(SubmittablePasFormValidations),
      SubmittablePasFormValidations,
    );

    this.saveableChanges.on('beforeValidation', (key) => {
      this.submittableChanges[key] = this.saveableChanges[key];
    });

    this.saveableChanges.on('afterValidation', () => {
      this.submittableChanges.validate();
    });

    // ember changeset does not validate when a changeset is initiated.
    // this handles that validation.
    this.saveableChanges.validate();
    this.submittableChanges.validate();

    console.assert(!!this.args.onSave, 'You didnt pass a callback'); // eslint-disable-line
    console.assert(!!this.args.onSubmit, 'You didnt pass a callback'); // eslint-disable-line
  }

  get package() {
    return this.args.package || {};
  }

  get pasForm() {
    return this.package.pasForm || {};
  }

  get isSaveable() {
    const {
      isDirty: isPasFormDirty,
      isValid: isPasFormValid,
    } = this.saveableChanges;
    const {
      isBblsDirty,
      isApplicantsDirty,
    } = this.pasForm;

    return (isPasFormDirty && isPasFormValid) || isBblsDirty || isApplicantsDirty;
  }

  get isSubmittable() {
    return this.submittableChanges.isValid;
  }

  @action
  async save() {
    await this.saveableChanges.save();

    this.args.onSave();
  }

  @action
  async submit() {
    await this.submittableChanges.save();

    this.args.onSubmit();
  }

  @action
  validate() {
    this.saveableChanges.validate();
  }

  @tracked modalIsOpen = false;

  @action
  toggleModal() {
    this.modalIsOpen = !this.modalIsOpen;
  }
}
