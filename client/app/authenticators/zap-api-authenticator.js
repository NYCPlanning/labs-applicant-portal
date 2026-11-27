import fetch from 'fetch';
import { isEmpty } from '@ember/utils';
import RSVP from 'rsvp';
import ENV from '../config/environment';
import BaseAuthenticator from 'ember-simple-auth/authenticators/base';

export default class ZAPAuthenticator extends BaseAuthenticator {
  // keep the user signed in across page reloads
  restore(data) {
    if (isEmpty(data.access_token)) return RSVP.reject();

    return RSVP.resolve(data);
  }

  async authenticate({ code, codeVerifier, redirectUri }) {
    console.log("in authenticator");
    const params = new URLSearchParams({ code, codeVerifier, redirectUri });
    console.log("params",  { code, codeVerifier, redirectUri });


    const response = await fetch(`${ENV.host}/login?${params}`, {
      credentials: 'include',
    });

    if (!response.ok) throw await response.json();

    const {
      access_token, nycid, contactId, emailaddress1,
    } = await response.json();

    console.log("access_token", access_token);
    console.log("nycid", nycid);
    console.log("contactId", contactId);
    return {
      access_token, nycid, contactId, emailaddress1,
    };
  }
}
