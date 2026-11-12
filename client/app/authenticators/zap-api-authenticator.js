import fetch from 'fetch';
import { InvalidError } from '@ember-data/adapter/error';
import jwtDecode from 'jwt-decode';
import ENV from '../config/environment';
import BaseAuthenticator from 'ember-simple-auth/authenticators/base';

export default class ZAPAuthenticator extends BaseAuthenticator {
  // keep the user signed in across page reloads
  restore(data) {
    if (isEmpty(data.access_token)) return RSVP.reject();

    return RSVP.resolve(data);
  }
  
  // async authenticate(...args) {
  //   let accessToken;

  //   try {
  //     const { access_token } = await super.authenticate(...args);

  //     accessToken = access_token;
  //   } catch (e) {
  //     throw new InvalidError([{ detail: e.toString() }]);
  //   }

  //   let attemptedLoginEmail = '';
  //   const NYCIDUser = jwtDecode(accessToken);

  //   // attempt to decode the token to include email address for debugging
  //   const { mail } = NYCIDUser;

  //   attemptedLoginEmail = mail;

  //   // Pass the NYCIDToken to backend /login endpoint.
  //   // Server should provide an access_token used for signing
  //   // requests using the Authorization header
  //   const response = await fetch(`${ENV.host}/login?accessToken=${accessToken}&DEBUG_useremail=${attemptedLoginEmail}`);
  //   const body = await response.json();

  //   if (!response.ok) throw body;

  //   const displayName = `${(typeof NYCIDUser.givenName === 'undefined') ? '' : NYCIDUser.givenName} ${(typeof NYCIDUser.sn === 'undefined') ? '' : NYCIDUser.sn}`;

  //   try {
  //     // eslint-disable-next-line no-undef
  //     FS.identify(NYCIDUser.GUID, {
  //       displayName,
  //       email: mail,
  //     });
  //   } catch (e) {
  //     // eslint-disable-next-line no-console
  //     console.log('FS.identify failed.  This may happen during tests, if using incognito mode, or if Mirage is blocking your request. Error message:', e);
  //   }

  //   // Since all requests to the API are now authenticated.
  //   // Returning the session data's "authenticated" property and marks
  //   // the session as authenticated.
  //   // See: https://ember-simple-auth.com/api/classes/SessionService.html
  //   return {
  //     ...body,
  //     ...NYCIDUser,
  //   };
  // }
  async authenticate({ code, codeVerifier, redirectUri }) {
    const params = new URLSearchParams({ code, codeVerifier, redirectUri });


    const response = await fetch(`${ENV.host}/login?${params}`, {
      credentials: 'include',
    });

    if (!response.ok) throw await response.json();

    const { access_token, nycid } = await response.json();

    const displayName = `${(typeof nycid.given_name === 'undefined') ? '' : nycid.given_name} ${(typeof nycid.family_name === 'undefined') ? '' : nycid.family_name}`;

    try {
      // eslint-disable-next-line no-undef
      FS.identify(nycid.sub, {
        displayName,
        email: nycid.email,
        zapSearchHasLoggedIn: true,
      });
    } catch (e) {
      throw new InvalidError([{ detail: e, message: 'FS.identify failed.' }]);
    }

    return { access_token };
  }
}
