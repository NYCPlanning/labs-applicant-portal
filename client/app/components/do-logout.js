import Component from '@glimmer/component';
import ENV from '../config/environment';

export default class DoLogoutComponent extends Component {
  get nycIDHost() {
    const { origin } = new URL(ENV.NYCIDLocation || 'https://accounts-nonprd.nyc.gov');

    return `${origin}/account/idpLogout.htm?x-frames-allow-from=${this.origin}`;
  }

  origin = window.location.origin;
}
