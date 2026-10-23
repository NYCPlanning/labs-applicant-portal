import Component from '@glimmer/component';
import config from 'client/config/environment';

export default class ProjectsNewProjectDescription extends Component {
  fastTrackFlagOn = config.featureFlagShowFastTrackCheckbox;
}
