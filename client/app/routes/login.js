import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import window from 'ember-window-mock';

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

export default class LoginRoute extends Route {
  @service
  session

  // hit /login in backend
  async beforeModel() {
    console.log("LoginRoute beforeModel");
    const code = new URLSearchParams(window.location.search).get('code');
    const { codeVerifier } = this.session.data;
    this.session.set('data.codeVerifier', undefined);

    await this.session.authenticate('authenticator:zap-api-authenticator', {
      code,
      codeVerifier,
      redirectUri: `${window.location.origin}/login`,
    });

    // redirect
    const contact = await this.store.queryRecord('contact', { me: true });
    console.log("contact", contact);
    if (!contact.isNycidValidated) {
            console.log("not validated email addres");

      this.transitionTo('auth.validate', { queryParams: { loginEmail: contact.emailaddress1 } });
    }
  }

  afterModel() {
    this.transitionTo('projects');
  }
}
