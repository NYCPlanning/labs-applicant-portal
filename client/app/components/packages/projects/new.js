import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import SubmittableProjectNewForm from '../../../validations/submittable-project-new-form';

export default class ProjectsNewFormComponent extends Component {
  validations = {
    SubmittableProjectNewForm
  };

  @service
  router;

  @service
  store;

  @action
  async submitPackage() {
    try {
      await this.args.package.submit();
    } catch (error) {
      console.log('Save new project package error:', error);
    }
  }
}
