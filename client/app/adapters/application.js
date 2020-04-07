import JSONAPIAdapter from '@ember-data/adapter/json-api';
import ENV from '../config/environment';

export default class ApplicationAdapter extends JSONAPIAdapter {
  host = ENV.host;

  // TODO: find better approach, this is a private method.
  // see https://github.com/emberjs/data/issues/6413
  // we must override so it includes the cookie
  _fetchRequest(options) {
    options.credentials = 'include';

    return fetch(options.url, options);
  }
}
