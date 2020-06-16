import Component from '@glimmer/component';
import { action } from '@ember/object';
import SaveableRwcdsFormValidations from '../../../validations/saveable-rwcds-form';
import SubmittableRwcdsFormValidations from '../../../validations/submittable-rwcds-form';

export default class PackagesRwcdsFormEditComponent extends Component {
  saveableRwcdsFormValidations = SaveableRwcdsFormValidations;

  submittableRwcdsFormValidations = SubmittableRwcdsFormValidations;

  @action
  async savePackage() {
    try {
      await this.args.package.save();
      await this.args.package.reload();
    } catch (error) {
      console.log('Save RWCDS package error:', error);
    }
  }
}
