import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { Changeset } from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import { task } from 'ember-concurrency';
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
    const {
      isDirty: isAttachmentsDirty,
    } = this.package.fileManager;

    return !this.isUpdatingDb && ((isPasFormDirty
      && isPasFormValid)
      || isBblsDirty
      || isApplicantsDirty
      || isAttachmentsDirty
    );
  }

  get isSubmittable() {
    return !this.isUpdatingDb && this.submittableChanges.isValid;
  }

  get isUpdatingDb() {
    return this.save.isRunning || this.submit.isRunning;
  }

  @task(function* () {
    try {
      yield this.saveableChanges.execute();
      yield this.args.onSave();
      yield this.saveableChanges.rollback();
    } catch (adapterError) {
      console.log('Save error:', adapterError);
    }
  }).withTestWaiter()
  save;

  @task(function* () {
    try {
      yield this.submittableChanges.execute();
      yield this.args.onSubmit();
      yield this.saveableChanges.rollback();
    } catch (adapterError) {
      console.log('Submit error:', adapterError);
    }
  }).withTestWaiter()
  submit;

  @action
  validate() {
    this.saveableChanges.validate();
  }

  @tracked modalIsOpen = false;

  @action
  toggleModal() {
    if (!this.save.isRunning) {
      this.modalIsOpen = !this.modalIsOpen;
    }
  }
}
