import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class PackagesEditController extends Controller {
  @action
  savePackage() {
    this.model.saveDescendants();
  }

  @action
  submitPackage() {
    this.model.submit();

    this.transitionToRoute('packages.show', this.model.id);
  }
}
