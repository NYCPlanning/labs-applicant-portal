import Component from '@ember/component';
import { action } from '@ember/object';
import ENV from '../../config/environment';

export default class DoLogout extends Component {
  get nycIDHost() {
    const { origin } = new URL(ENV.NYCIDLocation || 'https://accounts-nonprd.nyc.gov');

    return `${origin}/account/idpLogout.htm?x-frames-allow-from=${this.origin}`;
  }

  origin = window.location.origin;

  iFrameDidLoad = false;

  @action
  didLogoutNycId() {
    this.set('iFrameDidLoad', true);
  }
}
