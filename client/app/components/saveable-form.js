import Component from '@glimmer/component';
import { Changeset } from 'ember-changeset';
import { task } from 'ember-concurrency';
import { action } from '@ember/object';
import lookupValidator from 'ember-changeset-validations';

export default class SaveableFormComponent extends Component {
  constructor(...args) {
    super(...args);

    const [
      saveabilityValidations = {},
      submittabilityValidations = {},
    ] = this.args.validators || [];

    this.saveableChanges = new Changeset(
      this.args.model,
      lookupValidator(saveabilityValidations),
      saveabilityValidations,
    );

    this.submittableChanges = new Changeset(
      this.args.model,
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
}
