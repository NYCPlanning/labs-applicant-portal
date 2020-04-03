import BaseAuthenticator from 'ember-simple-auth/authenticators/base';
import fetch from 'fetch';
import location from 'ember-simple-auth/utils/location';
import { inject as service } from '@ember/service';
import ENV from 'labs-zap-search/config/environment';

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
  async _fetchUserObject() {
    const user = await this.store.queryRecord('user', { me: true });

    return { id: user.id, ...user.toJSON() };
  }

  async authenticate() {
    // Extract NYCID Token from URL
    const { NYCIDToken } = _parseResponse(location().hash);

    if (!NYCIDToken) {
      throw { errors: [{ detail: 'No NYCID token present' }] }; // eslint-disable-line
    }

    // Pass the NYCIDToken to backend /login endpoint.
    // The backend's response will contain a Cookie with a ZAP token.
    // This Cookie is automatically stored away and used in future requests to the
    // backend.
    const response = await fetch(`${ENV.host}/login?accessToken=${NYCIDToken}`, {
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
    return this._fetchUserObject();
  }

  restore() {
    return this._fetchUserObject();
  }
}
