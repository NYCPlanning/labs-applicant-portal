import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import SaveableRwcdsFormValidations from '../../../validations/saveable-rwcds-form';
import SubmittableRwcdsFormValidations from '../../../validations/submittable-rwcds-form';
import SaveableAffectedZoningResolutionFormValidations from '../../../validations/saveable-affected-zoning-resolution-form';
import SubmittableAffectedZoningResolutionFormValidations from '../../../validations/submittable-affected-zoning-resolution-form';
import SubmittableProjectFormValidations from '../../../validations/submittable-project-form';

export default class PackagesRwcdsFormEditComponent extends Component {
  validations = {
    SaveableRwcdsFormValidations,
    SubmittableRwcdsFormValidations,
    SaveableAffectedZoningResolutionFormValidations,
    SubmittableAffectedZoningResolutionFormValidations,
    SubmittableProjectFormValidations,
  };

  @service
  router;

  get rwcdsForm() {
    return this.args.package.rwcdsForm || {};
  }


  @action
  async savePackage() {
    try {
      await this.args.package.save();
    } catch (error) {
      console.log('Save RWCDS package error:', error); // eslint-disable-line
    }
  }

  @action
  async submitPackage() {
    await this.args.package.submit();

    if (!this.rwcdsForm.adapterError && !this.args.package.adapterError && !this.args.package.fileUploadErrors) {
      this.router.transitionTo('rwcds-form.show', this.args.package.id);
    }
  }
}
