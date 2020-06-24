import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class CollapsibleTextComponent extends Component {
  @tracked showAdditionalText = false;

  @action
  toggleAdditionalText() {
    this.showAdditionalText = !this.showAdditionalText;
  }
}
