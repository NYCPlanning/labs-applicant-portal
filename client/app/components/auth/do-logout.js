import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action, set } from '@ember/object';
import { inject as service } from '@ember/service';
import ENV from 'client/config/environment';

export default class DoLogout extends Component {
  @service session;

  @tracked
  iFrameDidLoad = false;

  origin = window.location.origin;

  get nycIDHost() {
    const { origin } = new URL(ENV.NYCIDLocation || this.origin);

    return `${origin}/account/idpLogout.htm?x-frames-allow-from=${this.origin}`;
  }

  @action
  didLogoutNycId() {
    this.session.invalidate(); // also logout of the current session

    set(this, 'iFrameDidLoad', true);
  }
}
