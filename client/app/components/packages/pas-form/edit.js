import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class PasFormComponent extends Component {
  @tracked modalIsOpen = false;

  @tracked package;

  // TODO: consider decoupling the PAS Form from the Package
  // for better modularity and avoiding "inappropriate intimacy"
  @action
  save(packageInstance) {
    packageInstance.saveDescendants();
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
