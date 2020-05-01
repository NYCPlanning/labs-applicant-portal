import { Response } from 'ember-cli-mirage';
import ENV from '../config/environment';

export default function() {
  this.passthrough('https://search-api.planninglabs.nyc/**');
  // These comments are here to help you get started. Feel free to delete them.

  /*
    Config (with defaults).

    Note: these only affect routes defined *after* them!
  */

  // this.urlPrefix = '';    // make this `http://localhost:8080`, for example, if your API is on a different server
  // this.namespace = '';    // make this `/api`, for example, if your API is namespaced
  // this.timing = 400;      // delay for each request, automatically set to 0 during testing

  // conditionally allow the host to pass through if present
  if (ENV.host) {
    this.passthrough(`${ENV.host}/**`);
  }

  this.get('/projects');
  this.get('/contacts', (schema) => schema.contacts.first());

  this.get('/login', () => ({ ok: true }));
  this.get('/logout');

  this.get('/packages');
  this.get('/packages/:id');
  this.get('/applicants');
  this.get('/applicants/:id');
  this.patch('/applicants/:id');
  this.post('/applicants');

  this.get('/bbls');
  this.get('/bbls/:id');
  this.patch('/bbls/:id');

  this.post('/document', function(schema, request) {
    // requestBody should be a FormData object
    const { requestBody } = request;
    const success = requestBody.get('instanceId') && requestBody.get('entityName') && requestBody.get('file');
    return success ? new Response(200) : new Response(400, {}, { errors: ['Bad Parameters'] });
  });

  // Assumes that the backend delivers files each with
  // a unique CRM or sharepoint based ID.
  // TODO: If this is not possible, rework this to be a
  // POST request for a differently named endpoint, like
  // deleteDocument
  this.del('/document/:id', function(schema, request) {
    const { params: { id } } = request;
    return id ? new Response(200) : new Response(400, {}, { errors: ['Bad Parameters'] });
  });
  /*
    Shorthand cheatsheet:

    this.get('/posts');
    this.post('/posts');
    this.get('/posts/:id');
    this.put('/posts/:id'); // or this.patch
    this.del('/posts/:id');

    https://www.ember-cli-mirage.com/docs/route-handlers/shorthands
  */
}
