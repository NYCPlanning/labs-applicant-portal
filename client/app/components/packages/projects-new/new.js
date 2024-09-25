import Component from "@glimmer/component";
import { inject as service } from "@ember/service";

export default class ProjectsNewFormComponent extends Component {
  validations = {};

  @service
  router;
}