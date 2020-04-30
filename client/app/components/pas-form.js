import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class PasFormComponent extends Component {
  @tracked package;

  @action
  updateAttr(obj, attr, newVal) {
    console.log(...arguments);
    obj[attr] = newVal;
  }
}
