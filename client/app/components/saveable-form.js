import Component from '@glimmer/component';
import { Changeset } from 'ember-changeset';
import { action } from '@ember/object';
import lookupValidator from 'ember-changeset-validations';

export default class SaveableFormComponent extends Component {
  constructor(...args) {
    super(...args);

    const [
      saveabilityValidations = {},
      submittabilityValidations = {},
    ] = this.args.validators || [];

    this.saveableChanges = Changeset(
      this.args.model,
      lookupValidator(saveabilityValidations),
      saveabilityValidations,
    );

    this.submittableChanges = Changeset(
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

  async saveChangeset(changeset, callback) {
    try {
      await changeset.execute();
      await callback();
      await changeset.rollback();
    } catch (error) {
      console.log('Save error:', error);
    }
  }

  @action
  validate() {
    this.saveableChanges.validate();
  }
}
