import fetch from 'fetch';
import OAuth2ImplicitGrantAuthenticator from 'ember-simple-auth/authenticators/oauth2-implicit-grant';
import { InvalidError } from '@ember-data/adapter/error';
import ENV from '../config/environment';

export default class ZAPAuthenticator extends OAuth2ImplicitGrantAuthenticator {
  async authenticate(...args) {
    let accessToken;

    try {
      const { access_token } = await super.authenticate(...args);

      accessToken = access_token;
    } catch (e) {
      throw new InvalidError([{ detail: e.toString() }]);
    }

    // Pass the NYCIDToken to backend /login endpoint.
    // Server should provide an access_token used for signing
    // requests using the Authorization header
    const response = await fetch(`${ENV.host}/login?accessToken=${accessToken}`);
    const body = await response.json();

    if (!response.ok) throw body;

    // Since all requests to the API are now authenticated.
    // Returning the session data's "authenticated" property and marks
    // the session as authenticated.
    // See: https://ember-simple-auth.com/api/classes/SessionService.html
    return body;
  }

  invalidate() {
    return fetch(`${ENV.host}/logout`, {
      mode: 'same-origin',
      credentials: 'include',
    });
  }
}
