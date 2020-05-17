import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import SaveablePasForm from '../../../validations/saveable-pas-form';
import SubmittablePasForm from '../../../validations/submittable-pas-form';

export default class PasFormComponent extends Component {
  saveablePasFormValidations = SaveablePasForm;

  submittablePasFormValidations = SubmittablePasForm;

  get package() {
    return this.args.package || {};
  }

  get pasForm() {
    return this.package.pasForm || {};
  }

  @tracked modalIsOpen = false;

  @action
  toggleModal() {
    this.modalIsOpen = !this.modalIsOpen;
  }
}
