import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

const noop = async () => {};

export default class AuthSignInComponent extends Component {
  @service
  router;

  email;

  searchContacts = this.args.searchContacts || noop;

  @tracked
  isLoginStarted = false;

  @action
  async startLogin(loginEmail, event) {
    event.preventDefault();

    this.isLoginStarted = true;

    const {
      isNycidValidated,
      isNycidEmailRegistered,
      isCityEmployee,
    } = await this.args.searchContacts(loginEmail);

    if (isNycidEmailRegistered) {
      // we can only know email validation after they logged in once.
      // if it's null, it means we don't know because they've never logged in before (null).
      if (isNycidValidated === true || isNycidValidated === null) {
        this.router.transitionTo('auth.login', { queryParams: { loginEmail, isCityEmployee } });
      } else if (isNycidValidated === false) {
        this.router.transitionTo('auth.validate', { queryParams: { loginEmail } });
      }
    } else {
      this.router.transitionTo('auth.register', { queryParams: { loginEmail } });
    }
  }
}
