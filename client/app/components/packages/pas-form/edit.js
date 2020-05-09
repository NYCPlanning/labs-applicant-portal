import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
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

    // Proxy object used here to unify the interface across
    // both changeset validations. this is used here because
    // we want to 2-way bind the same reference into the input
    // helpers, but emit upstream setter changes to both
    // changesets.
    this.unifiedChanges = new Proxy(this.saveableChanges, {
      get(saveableChanges, prop) {
        return saveableChanges[prop];
      },

      // arrow function here to keep the scope of constructor
      set: (saveableChanges, prop, value) => {
        saveableChanges[prop] = value;

        this.submittableChanges[prop] = value;

        return true;
      },
    });
  }

  @service router;

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

    this.router.transitionTo('packages.show', this.package.id);
  }

  @action
  updateAttr(obj, attr, newVal) {
    obj[attr] = newVal;
  }

  @tracked modalIsOpen = false;

  @action
  toggleModal() {
    this.modalIsOpen = !this.modalIsOpen;
  }
}
