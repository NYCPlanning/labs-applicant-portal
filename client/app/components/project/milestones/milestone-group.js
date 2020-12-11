import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ProjectMilestonesMilestoneGroupComponent extends Component {
  @tracked
  _showMilestones = this.args.showMilestones ?? false;

  @action
  toggleshowMilestones() {
    this._showMilestones = !this._showMilestones;
  }

  groupsToShow = [
    'Completed',
    'In Progress',
    'Not Started',
  ];

  get showGroup() {
    return this.groupsToShow.includes(this.args.status);
  }
}
