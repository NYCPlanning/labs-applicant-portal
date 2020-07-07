import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class CollapsibleTextComponent extends Component {
  @tracked showAdditionalText;

  @action
  toggleAdditionalText() {
    this.showAdditionalText = !this.showAdditionalText;
  }
}
