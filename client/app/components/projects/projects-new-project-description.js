import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class ProjectsNewProjectDescription extends Component {
  @action
  handleFastTrackChange(event) {
    if (event.target.type !== 'checkbox') return;

    this.args.onFastTrackChange(event.target.checked);
  }
}
