import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import SubmittablePackageFormValidations from '../../../validations/submittable-package';

export default class PackagesWorkingPackageEditComponent extends Component {
  validations = {
    SubmittablePackageFormValidations,
  };

  @service
  router;

  @action
  async savePackage() {
    try {
      await this.args.package.save();
    } catch (error) {
      console.log('Save Working Package package error:', error);
    }
  }
}
