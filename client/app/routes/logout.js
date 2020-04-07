import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class LogoutRoute extends Route {
  @service session;

  @action
  didTransition() {
    this.session.invalidate();
  }
}
