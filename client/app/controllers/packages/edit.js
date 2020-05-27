import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class PackagesEditController extends Controller {
  @action
  refreshModelFromEditController() {
    this.send('refreshModel');
  }
}
