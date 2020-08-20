import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
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

  @service
  router;

  @action
  async savePackage() {
    try {
      await this.args.package.save();
      await this.args.package.reload();
    } catch (error) {
      console.log('Save RWCDS package error:', error);
    }
  }

  @action
  async submitPackage() {
    await this.args.package.submit();

    this.router.transitionTo('rwcds-form.show', this.args.package.id);
  }
}
