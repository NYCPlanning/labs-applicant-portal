import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class PackagesEditController extends Controller {
  @action
  async savePackage() {
    await this.model.saveDescendants();
  }

  @action
  async submitPackage() {
    await this.model.submit();

    this.transitionToRoute('packages.show', this.model.id);
  }
}
