import Component from '@glimmer/component';
import { action } from '@ember/object';
import SaveableLanduseFormValidations from '../../../validations/saveable-landuse-form';
import SubmittableLanduseFormValidations from '../../../validations/submittable-landuse-form';

export default class PasFormComponent extends Component {
  validations = {
    SaveableLanduseFormValidations,
    SubmittableLanduseFormValidations,
  };

  @action
  async savePackage() {
    try {
      await this.args.package.save();
    } catch (error) {
      console.log('Save Landuse package error:', error);
    }
  }

  @action
  async submitPackage() {
    await this.args.package.submit();

    this.router.transitionTo('land-use.show', this.args.package.id);
  }
}
