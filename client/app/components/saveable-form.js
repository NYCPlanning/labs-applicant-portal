import Component from '@glimmer/component';
import { action } from '@ember/object';
import { TrackedSet } from 'tracked-maps-and-sets';
import createChangeset from '../utils/create-changeset';

const noop = () => {};

export default class SaveableFormComponent extends Component {
  saveableChanges = createChangeset(this.args.model, this.args.validators[0]);

  submittableChanges = createChangeset(this.args.model, this.args.validators[1], { dependsOn: this.saveableChanges });

  registeredDescendants = new TrackedSet();

  get _registeredDescendants() {
    return Array.from(this.registeredDescendants);
  }

  get hasDirtyDescendants() {
    return this._registeredDescendants.any((saveableForm) => saveableForm._isDirty === true);
  }

  get hasValidDescendants() {
    return this.registeredDescendants.size ? this._registeredDescendants.every((saveableForm) => saveableForm._isValid === true) : true;
  }

  get hasSubmittableDescendants() {
    return this.registeredDescendants.size ? this._registeredDescendants.every((saveableForm) => saveableForm.isSubmittable === true) : true;
  }

  // savability criteria
  get _isDirty() {
    return this.saveableChanges.isDirty || this.hasDirtyDescendants;
  }

  get _isValid() {
    return this.saveableChanges.isValid && this.hasValidDescendants;
  }

  // passes saveability validations and is dirty
  get isSaveable() {
    return this._isDirty && this._isValid;
  }

  // passes submittability validations
  get isSubmittable() {
    return this.submittableChanges.isValid && this.hasSubmittableDescendants;
  }

  // TODO: Understand why this particular sequencing is necessary.
  // Can the callback happen afterwards?
  async _saveChangeset(changeset, callback) {
    try {
      await changeset.execute();
      await callback();
      await changeset.rollback();
    } catch (error) {
      console.log('Save error:', error);
    }
  }

  @action
  async persistSaveableChangeset(callback = noop) {
    this.registeredDescendants.forEach((descendent) => {
      descendent.persistSaveableChangeset();
    });

    await this._saveChangeset(this.saveableChanges, callback);
  }

  @action
  async persistSubmittableChangeset(callback = noop) {
    this.registeredDescendants.forEach((descendent) => {
      descendent.persistSubmittableChangeset();
    });

    await this._saveChangeset(this.saveableChanges, callback);
  }

  @action
  validate(changeset) {
    changeset.validate();
  }

  @action
  register(changeset) {
    this.registeredDescendants.add(changeset);
  }

  willDestroy() {
    this.registeredDescendants.clear();
  }
}
