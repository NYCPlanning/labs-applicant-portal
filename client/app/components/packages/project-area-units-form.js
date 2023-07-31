import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class ProjectAreaUnitsFormComponent extends Component {
  @tracked
  defaultInputValue = 0;

  @tracked
  dirtyInputValue = null;

  get inputValue() {
    return this.dirtyInputValue;
  }
}
