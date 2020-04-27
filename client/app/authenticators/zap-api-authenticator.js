import BaseAuthenticator from 'ember-simple-auth/authenticators/base';
import fetch from 'fetch';
import window from 'ember-window-mock';
import { inject as service } from '@ember/service';
import ENV from '../config/environment';

// lifted from https://github.com/simplabs/ember-simple-auth/blob/master/addon/mixins/oauth2-implicit-grant-callback-route-mixin.js#L6
// parses a window hash and grabs the access token
function _parseResponse(locationHash) {
  const params = {};
  const query = locationHash.substring(locationHash.indexOf('?'));
  const regex = /([^#?&=]+)=([^&]*)/g;
  let match;

  // decode all parameter pairs
  while ((match = regex.exec(query)) !== null) { // eslint-disable-line
    params[decodeURIComponent(match[1])] = decodeURIComponent(match[2]);
  }

  return params;
}

export default class ZAPAuthenticator extends BaseAuthenticator {
  @service
  store

  // Authentication is implicit with an httponly cookie holding
  // a ZAP Token. This request will fail if that cookie doesn't exist
  // https://github.com/simplabs/ember-simple-auth/blob/master/guides/managing-current-user.md#using-a-dedicated-endpoint
  async _fetchContact() {
    const { id, emailaddress1, contactid } = await this.store.queryRecord('contact', { me: true });

    return { id, emailaddress1, contactid };
  }

  async authenticate() {
    // Extract NYCID Token from URL
    const { access_token } = _parseResponse(window.location.hash);

    if (!access_token) {
      throw 'No NYCID token present'; // eslint-disable-line
    }

    // Pass the NYCIDToken to backend /login endpoint.
    // The backend's response will contain a Cookie with a ZAP token.
    // This Cookie is automatically stored away and used in future requests to the
    // backend.
    const response = await fetch(`${ENV.host}/login?accessToken=${access_token}`, {
      mode: 'same-origin',
      credentials: 'include',
    });

    if (!response.ok) throw await response.json();

    // Since all requests to the API are now authenticated,
    // formally request a User through Ember Data and return it.
    // Returning the user data here places it inside
    // the session data's "authenticated" property and marks
    // the session as authenticated.
    // See: https://ember-simple-auth.com/api/classes/SessionService.html
    return this._fetchContact();
  }

  invalidate() {
    return fetch(`${ENV.host}/logout`, {
      mode: 'same-origin',
      credentials: 'include',
    });
  }

  restore() {
    return this._fetchContact();
  }
}
