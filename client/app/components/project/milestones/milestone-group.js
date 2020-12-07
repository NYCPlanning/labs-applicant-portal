import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ProjectMilestonesMilestoneGroupComponent extends Component {
  @tracked
  showMilestones = false;

  @action
  toggleshowMilestones() {
    this.showMilestones = !this.showMilestones;
  }
}
