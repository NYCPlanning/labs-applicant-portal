import Component from '@glimmer/component';
import SaveableRwcdsFormValidations from '../../../validations/saveable-rwcds-form';
import SubmittableRwcdsFormValidations from '../../../validations/submittable-rwcds-form';

export default class PackagesRwcdsFormEditComponent extends Component {
  saveableRwcdsFormValidations = SaveableRwcdsFormValidations;

  submittableRwcdsFormValidations = SubmittableRwcdsFormValidations;
}
