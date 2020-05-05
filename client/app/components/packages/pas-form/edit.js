import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class PasFormComponent extends Component {
  @service router;

  @tracked modalIsOpen = false;

  @tracked package;

  // TODO: consider decoupling the PAS Form from the Package
  // for better modularity and avoiding "inappropriate intimacy"
  @action
  save(projectPackage) {
    projectPackage.saveDescendants();
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
