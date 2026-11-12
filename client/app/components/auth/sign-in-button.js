import Component from '@glimmer/component';
import ENV from '../../config/environment';
import { inject as service } from '@ember/service';
import { returnCodeVerifier, createCodeChallenge } from '../../utils/pkce';
import { action } from '@ember/object';

export default class SignInButtonComponent extends Component {
  @service
  session;

  @action
  async signIn() {
    const codeVerifier = returnCodeVerifier();
    const codeChallenge = await createCodeChallenge(codeVerifier);
    this.session.set('data.codeVerifier', codeVerifier);
    const redirectUri = encodeURIComponent(`${window.location.origin}/login`);

    const loginLocation = `${ENV.NYCIDLocation}`
      + `&redirect_uri=${redirectUri}`
      + '&code_challenge_method=S256'
      + `&code_challenge=${codeChallenge}`
      + '&scope=openid%20email';
    console.log('ENV.NYCIDLocation', loginLocation);
    window.location.assign(loginLocation);
  }
}
