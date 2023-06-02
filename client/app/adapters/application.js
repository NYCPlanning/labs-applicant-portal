import JSONAPIAdapter from '@ember-data/adapter/json-api';
import { inject as service } from '@ember/service';
import ENV from 'client/config/environment';

export default class ApplicationAdapter extends JSONAPIAdapter {
  @service
  session;

  host = ENV.host;

  get headers() {
    if (this.session.isAuthenticated) {
      return {
        Authorization: `Bearer ${this.session.data.authenticated.access_token}`,
      };
    }

    return {};
  }
}
