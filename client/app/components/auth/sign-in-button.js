import Component from '@glimmer/component';
import { action } from '@ember/object';
import window from 'ember-window-mock';
import ENV from '../../config/environment';

export default class SignInButtonComponent extends Component {
  get loginLocation() {
    return ENV.NYCIDLocation;
  }

  @action
  handleLogin() {
    window.location.href = this.loginLocation;
  }
}
