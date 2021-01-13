import JSONAPIAdapter from '@ember-data/adapter/json-api';
import { inject as service } from '@ember/service';
import ENV from '../config/environment';

// Taken from
// https://github.com/emberjs/data/blob/v3.24.0/packages/adapter/addon/-private/utils/serialize-into-hash.js
function serializeIntoHash(store, modelClass, snapshot, options = { includeId: true }) {
  const serializer = store.serializerFor(modelClass.modelName);

  if (typeof serializer.serializeIntoHash === 'function') {
    const data = {};
    serializer.serializeIntoHash(data, modelClass, snapshot, options);
    return data;
  }

  return serializer.serialize(snapshot, options);
}

export default class PackageAdapter extends JSONAPIAdapter {
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

  // Delete the documents array from Snapshot because
  // package.documents is read-only.
  // Discarding it from the update prevents
  // serialization errors that occur when file upload fails.
  // When file upload fails, recursive ember-file-upload document objects
  // are inadvertently placed into the package.documents array.
  // These recursive objects cannot be serialized, so yield serialization
  // errors.
  updateRecord(store, type, snapshot) {
    snapshot.__attributes.documents = [];
    snapshot._changedAttributes.documents = [];

    const data = serializeIntoHash(store, type, snapshot);

    let url = this.buildURL(type.modelName, snapshot.id, snapshot, 'updateRecord');

    return this.ajax(url, 'PATCH', { data });
  }
}
