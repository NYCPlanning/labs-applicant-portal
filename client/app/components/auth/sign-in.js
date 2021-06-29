import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import ENV from 'client/config/environment';

const noop = async () => {};
const MAINTENANCE_RANGE = ENV.maintenanceTimes;

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

    // We should always be redirecting nyc government employees to the NYC.ID login page
    // (never to the register page) regardless of whether isNycidEmailRegistered is true or false
    if (isCityEmployee) {
      this.router.transitionTo('auth.login', { queryParams: { loginEmail, isCityEmployee } });
    } else {
      if (isNycidEmailRegistered) { // eslint-disable-line
        // we can only know email validation after they logged in once.
        // if it's null, it means we don't know because they've never logged in before (null).
        if (isNycidValidated === true || isNycidValidated === null) {
          this.router.transitionTo('auth.login', { queryParams: { loginEmail } });
        } else if (isNycidValidated === false) {
          this.router.transitionTo('auth.validate', { queryParams: { loginEmail } });
        }
      } else {
        this.router.transitionTo('auth.register', { queryParams: { loginEmail } });
      }
    }
  }

  get isMaintenancePeriod() {
    const [start, end] = MAINTENANCE_RANGE.map((string) => new Date(string));
    const now = new Date();

    return now > start && now < end;
  }

  get hasUpcomingMaintenance() {
    const [, end] = MAINTENANCE_RANGE.map((string) => new Date(string));
    const now = new Date();

    return now < end;
  }
}
