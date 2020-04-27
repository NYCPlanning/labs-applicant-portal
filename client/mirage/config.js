import ENV from '../config/environment';

export default function() {
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

  this.get('/packages/:id');

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
