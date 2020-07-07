import Component from '@glimmer/component';
import { action } from '@ember/object';
import SaveableRwcdsFormValidations from '../../../validations/saveable-rwcds-form';
import SubmittableRwcdsFormValidations from '../../../validations/submittable-rwcds-form';
import SaveableAffectedZoningResolutionFormValidations from '../../../validations/saveable-affected-zoning-resolution-form';
import SubmittableAffectedZoningResolutionFormValidations from '../../../validations/submittable-affected-zoning-resolution-form';

export default class PackagesRwcdsFormEditComponent extends Component {
  validations = {
    SaveableRwcdsFormValidations,
    SubmittableRwcdsFormValidations,
    SaveableAffectedZoningResolutionFormValidations,
    SubmittableAffectedZoningResolutionFormValidations,
  };

  @action
  async savePackage() {
    try {
      await this.args.package.save();
      await this.args.package.reload();
    } catch (error) {
      console.log('Save RWCDS package error:', error);
    }

    this.args.package.refreshExistingDocuments();
  }
}
