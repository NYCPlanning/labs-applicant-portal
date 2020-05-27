import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import SaveablePasFormValidations from '../../../validations/saveable-pas-form';
import SubmittablePasFormValidations from '../../../validations/submittable-pas-form';

export default class PasFormComponent extends Component {
  @service
  router;

  saveablePasFormValidations = SaveablePasFormValidations;

  submittablePasFormValidations = SubmittablePasFormValidations;

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

  @action
  async savePackage() {
    await this.args.package.save();
    console.log('heya', this.args.refreshModel);
    await this.args.refreshModel();
  }

  @action
  async submitPackage() {
    await this.args.package.submit();

    this.router.transitionTo('packages.show', this.args.package.id);
  }
}
