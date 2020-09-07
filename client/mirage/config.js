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
  this.patch('/projects/:id');
  this.get('/contacts');

  this.get('/projects/:id');

  this.get('/login', () => ({ ok: true }));
  this.get('/logout');

  this.get('/packages');
  this.get('/packages/:id');
  this.get('/applicants');
  this.get('/applicants/:id');
  this.patch('/applicants/:id');
  this.del('/applicants/:id');
  this.post('/applicants');

  this.get('/bbls');
  this.get('/bbls/:id');
  this.post('/bbls');
  this.patch('/bbls/:id');
  this.del('/bbls/:id');

  this.get('/affected-zoning-resolutions');
  this.get('/affected-zoning-resolutions/:id');
  this.patch('/affected-zoning-resolutions/:id');

  this.get('/rwcds-forms');
  this.get('/rwcds-forms/:id');
  this.patch('/rwcds-forms/:id');
  this.patch('/pas-forms');
  this.post('/pas-forms');
  this.patch('/pas-forms/:id');

  this.patch('/rwcds-forms');
  this.post('/rwcds-forms');
  this.patch('/rwcds-forms/:id');

  this.post('/packages');
  this.patch('/packages/:id');
  this.post('/applicants');

  this.patch('/landuse-forms');
  this.post('/landuse-forms');
  this.patch('/landuse-forms/:id');

  this.get('/related-actions');
  this.get('/related-actions/:id');
  this.patch('/related-actions/:id');
  this.del('/related-actions/:id');
  this.post('/related-actions');

  this.post('/documents', function(schema, request) {
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
  this.del('/documents', function() {
    return new Response(204);
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
