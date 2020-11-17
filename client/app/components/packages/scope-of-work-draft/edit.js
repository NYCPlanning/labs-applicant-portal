import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import SubmittablePackageFormValidations from '../../../validations/submittable-package';
import SubmittableCeqrInvoiceQuestionnaireFormValidations from '../../../validations/submittable-ceqr-invoice-questionnaire-form';

export default class PackagesScopeOfWorkDraftEditComponent extends Component {
  @service
  store;

  constructor(...args) {
    super(...args);

    if (this.args.package.ceqrInvoiceQuestionnaires.length < 1) {
      const newCeqrInvoiceQuestionnaire = this.store.createRecord('ceqr-invoice-questionnaire');
      this.args.package.ceqrInvoiceQuestionnaires.pushObject(newCeqrInvoiceQuestionnaire);
    }
  }

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
      console.log('Save Draft Scope of Work (DSOW) package error:', error);
    }
  }

  @action
  async submitPackage() {
    await this.args.package.submit();

    this.router.transitionTo('scope-of-work-draft.show', this.args.package.id);
  }
}
