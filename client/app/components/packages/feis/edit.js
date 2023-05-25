import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import SubmittablePackageFormValidations from '../../../validations/submittable-package';

export default class PackagesFeisEditComponent extends Component {
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
      // eslint-disable-next-line no-console
      console.log('Save Final EIS package error:', error);
    }
  }

  @action
  async submitPackage() {
    await this.args.package.submit();

    if (
      !this.args.package.adapterError
      && !this.args.package.fileUploadErrors
    ) {
      this.router.transitionTo('feis.show', this.args.package.id);
    }
  }
}
