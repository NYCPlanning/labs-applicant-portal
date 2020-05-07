import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ApplicationController extends Controller {
  @service session;

  userEmail = this.session.data.authenticated.emailaddress1;

  @action
  doLogout() {
    this.transitionToRoute('logout');
  }
}
