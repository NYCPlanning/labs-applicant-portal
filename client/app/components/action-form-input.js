import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ActionFormInputComponent extends Component {
  // value that field is to be changed to
  @tracked newVal;

  // updates target attribute on key-up event
  @action
  updateAttr(attr, newValue) {
    this.args.pasForm[attr] = newValue;
  }
}
