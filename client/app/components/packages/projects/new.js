import Component from "@glimmer/component";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { SaveableProjectForm } from "../../../validations/saveable-project-form";
import { SubmittableProjectForm } from "../../../validations/submittable-project-form";

export default class ProjectsNewFormComponent extends Component {
  validations = {
    SaveableProjectForm,
    SubmittableProjectForm
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
      console.log("Save new project package error:", error);
    }
  }
}