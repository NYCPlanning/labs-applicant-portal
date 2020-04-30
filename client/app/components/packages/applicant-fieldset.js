import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class ApplicantFieldset extends Component {
  // syncs radio input toggle to Ember model
  @action
  updateAttr(currentObject, attr, newVal) {
    currentObject[attr] = newVal;
  }
}
