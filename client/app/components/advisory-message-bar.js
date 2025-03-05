import Component from '@ember/component';
import { tracked } from '@glimmer/tracking';
import ENV from 'client/config/environment';

export default class AdvisoryMessageBarComponent extends Component {
  @tracked
  showSandboxWarningOn = ENV.showSandboxWarning;

  @tracked
  message = '';

  constructor() {
    super(...arguments);
    if (this.message === undefined) {
      this.message = '';
    }
  }
}
