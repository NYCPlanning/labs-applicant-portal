import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class ApplicantFieldset extends Component {
  @action
  removeApplicant() {
    console.log("REMOVE")
  }
}