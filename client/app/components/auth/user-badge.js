import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import ENV from '../../config/environment';

const encodeToBase64 = (string) => btoa(string);

export default class UserBadgeComponent extends Component {
  @service session;

  @service router;

  get redirectTarget() {
    const { origin } = window.location;

    return `${origin}/auth/sync?to=${window.location.pathname}`;
  }

  get userProfileURI() {
    const { origin } = new URL(
      ENV.NYCIDLocation || 'https://accounts-nonprd.nyc.gov',
    );

    // base64 is a requirement of NYC.ID — target value must be Base64-encoded
    return `${origin}/account/user/profile.htm?returnOnSave=true&target=${encodeToBase64(
      this.redirectTarget,
    )}`;
  }

  @action
  doLogout() {
    this.router.transitionTo('logout');
  }
}
