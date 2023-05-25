import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import SubmittablePackageFormValidations from '../../../validations/submittable-package';
import SubmittableCeqrInvoiceQuestionnaireFormValidations from '../../../validations/submittable-ceqr-invoice-questionnaire-form';

export default class PackagesScopeOfWorkDraftEditComponent extends Component {
  validations = {
    SubmittablePackageFormValidations,
    SubmittableCeqrInvoiceQuestionnaireFormValidations,
  };

  @service
  router;

  @action
  async savePackage() {
    try {
      await this.args.package.save();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('Save Draft Scope of Work (DSOW) package error:', error);
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
      this.router.transitionTo(
        'scope-of-work-draft.show',
        this.args.package.id,
      );
    }
  }
}
