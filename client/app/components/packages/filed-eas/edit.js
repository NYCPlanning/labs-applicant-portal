import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import SubmittablePackageFormValidations from '../../../validations/submittable-package';
import SubmittableCeqrInvoiceQuestionnaireFormValidations from '../../../validations/submittable-ceqr-invoice-questionnaire-form';

export default class PackagesFiledEasEditComponent extends Component {
  validations = {
    SubmittablePackageFormValidations,
  };

  @service
  router;

  validations = {
    SubmittableCeqrInvoiceQuestionnaireFormValidations,
  };

  @action
  async savePackage() {
    try {
      await this.args.package.save();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('Save Filed EAS package error:', error);
    }
  }

  @action
  async submitPackage() {
    await this.args.package.submit();

    if (
      !this.args.package.singleCeqrInvoiceQuestionnaire.adapterError
      && !this.args.package.adapterError
      && !this.args.package.fileUploadErrors
    ) {
      this.router.transitionTo('filed-eas.show', this.args.package.id);
    }
  }
}
