import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { Changeset } from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import PasFormValidations from '../../../validations/pas-form';

export default class PasFormComponent extends Component {
  constructor(...args) {
    super(...args);

    this.changeset = new Changeset(this.args.package.pasForm, lookupValidator(PasFormValidations));
  }

  @service router;

  @tracked modalIsOpen = false;

  get isDirty() {
    const { isDirty: isPasFormDirty } = this.changeset;
    const { isBblsDirty, isApplicantsDirty } = this.args.package.pasForm;

    return isPasFormDirty || isBblsDirty || isApplicantsDirty;
  }

  // TODO: consider decoupling the PAS Form from the Package
  // for better modularity and avoiding "inappropriate intimacy"
  @action
  async save(projectPackage) {
    await this.changeset.save();
    await projectPackage.saveDescendants();
  }

  @action
  async submit(projectPackage) {
    await projectPackage.saveDescendants();

    this.router.transitionTo('packages.show', projectPackage.id);
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
