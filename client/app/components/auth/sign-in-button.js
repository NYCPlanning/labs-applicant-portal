import Component from '@glimmer/component';
import ENV from 'client/config/environment';

export default class SignInButtonComponent extends Component {
  get loginLocation() {
    return ENV.NYCIDLocation;
  }
}
