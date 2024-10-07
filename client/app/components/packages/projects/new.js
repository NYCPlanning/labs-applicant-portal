import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import SubmittableProjectsNewForm from '../../../validations/submittable-projects-new-form';
import SubmittableProjectApplicantForm from '../../../validations/submittable-project-applicant-form';

export default class ProjectsNewFormComponent extends Component {
  validations = {
    SubmittableProjectsNewForm,
    SubmittableProjectApplicantForm
  };

  @service
  router;

  @service
  store;

  @action
  async submitPackage() {
    console.log("what is this?", this.args.package.projectApplicants);
    try {
      await this.args.package.submit();
    } catch (error) {
      console.log('Save new project package error:', error);
    }
  }
}
