import Component from '@glimmer/component';
import { TrackedSet } from 'tracked-maps-and-sets';
import { action } from '@ember/object';
import createChangeset from '../utils/create-changeset';

const noop = () => {};

export default class FormValidatorComponent extends Component {
  changeset = createChangeset(this.args.model, this.args.validator, { dependsOn: this.args.dependsOn });

  registeredDescendants = new TrackedSet();

  get _registeredDescendants() {
    return Array.from(this.registeredDescendants);
  }

  get hasDirtyDescendants() {
    return this._registeredDescendants.any((formvalidator) => formvalidator.isDirty === true);
  }

  get hasValidDescendants() {
    return this.registeredDescendants.size ? this._registeredDescendants.every((formvalidator) => formvalidator.isValid === true) : true;
  }

  get isDirty() {
    return this.changeset.isDirty || this.hasDirtyDescendants;
  }

  get isValid() {
    return this.changeset.isValid && this.hasValidDescendants;
  }

  @action
  register(component) {
    this.registeredDescendants.add(component);
  }

  @action
  validate() {
    this.changeset.validate();
  }

  async _persistChangeset(callback) {
    try {
      await this.changeset.execute();
      await callback();
      await this.changeset.rollback();
    } catch (error) {
      console.log('Save error:', error);
    }
  }

  @action
  async persist(callback = noop) {
    this.registeredDescendants.forEach((descendent) => {
      descendent.persist();
    });

    await this._persistChangeset(callback);
  }
}
