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

    const saveabilityValidations = this.args.saveabilityValidations || SaveablePasFormValidations;
    this.saveableChanges = new Changeset(
      this.pasForm,
      lookupValidator(saveabilityValidations),
      saveabilityValidations,
    );

    const submittabilityValidations = this.args.submittabilityValidations || SubmittablePasFormValidations;
    this.submittableChanges = new Changeset(
      this.pasForm,
      lookupValidator(submittabilityValidations),
      submittabilityValidations,
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

  @action
  async save() {
    await this.saveChangeset.perform(this.args.onSave, this.saveableChanges);
  }

  @action
  async submit() {
    await this.saveChangeset.perform(this.args.onSubmit, this.submittableChanges);
  }

  @task(function* (callback, changeset) {
    try {
      yield changeset.execute();
      yield callback();
      yield changeset.rollback();
    } catch (error) {
      console.log('Save error:', error);
    }
  }).withTestWaiter()
  saveChangeset;

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
