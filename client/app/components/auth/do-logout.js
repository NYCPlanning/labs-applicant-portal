import Component from '@ember/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import ENV from '../../config/environment';

export default class DoLogout extends Component {
  @service session;

  nycidLogoutBaseUrl = ENV.NYCID_LOGOUT_BASE_URL;
  
  origin = window.location.origin;

  iFrameDidLoad = false;

  @action
  didLogoutNycId() {
    this.session.invalidate(); // also logout of the current session

    this.set('iFrameDidLoad', true);
  }
}
