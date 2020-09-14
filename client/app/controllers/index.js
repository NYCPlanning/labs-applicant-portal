import Controller from '@ember/controller';
import { action } from '@ember/object';
import window from 'ember-window-mock';
import ENV from '../config/environment';

// TODO:  Don't repeat this logic from components/sign-in-button.js, make it reusable!
export default class IndexController extends Controller {
  get loginLocation() {
    return ENV.NYCIDLocation;
  }

  @action
  handleLogin() {
    window.location.href = this.loginLocation;
  }

  @action
  queryContacts(email) {
    return this.store.queryRecord('contact', { email });
  }
}
