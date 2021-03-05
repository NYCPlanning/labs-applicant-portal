import { Response } from 'ember-cli-mirage';
import ENV from '../config/environment';

export default function() {
  this.passthrough('https://search-api-production.herokuapp.com/**');
  this.passthrough('/account/**');
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

  this.get('/contacts', (schema) => schema.contacts.first());

  this.get('/projects');
  this.get('/projects/:id');
  this.patch('/projects/:id');

  this.get('/login', () => ({ ok: true }));
  this.get('/logout');

  this.get('/packages');
  this.get('/packages/:id', (schema, request) => {
    const { params: { id } } = request;

    const foundPackage = schema.packages.find(id);

    foundPackage.documents = [
      {
        name: 'PAS Form.pdf',
        timeCreated: '2021-01-09T02:54:28Z',
        serverRelativeUrl: '/sites/dcppfsuat2/dcp_package/2021Q0246_EIS_1_5C1BCD9B6E23EB11A813001DD8309FA8/testUploadFile3.txt',
      },
      {
        name: 'Action Changes.excel',
        timeCreated: '2021-01-09T02:07:31Z',
        serverRelativeUrl: '/sites/dcppfsuat2/dcp_package/2021Q0246_EIS_1_5C1BCD9B6E23EB11A813001DD8309FA8/fake-23.shp',
      },
    ];

    return foundPackage;
  });

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
  this.post('/affected-zoning-resolutions');
  this.del('/affected-zoning-resolutions/:id');

  this.get('/zoning-map-changes');
  this.get('/zoning-map-changes/:id');
  this.patch('/zoning-map-changes/:id');
  this.post('/zoning-map-changes');
  this.del('/zoning-map-changes/:id');

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

  this.get('/landuse-actions');
  this.patch('/landuse-actions/:id');

  this.get('/zoning-resolutions');

  this.get('/lead-agencys');
  this.get('/lead-agencys/:id');
  this.get('/accounts');
  this.get('/accounts/:id');

  this.get('/invoices/:id');

  this.get('/ceqr-invoice-questionnaires');
  this.get('/ceqr-invoice-questionnaires/:id');
  this.patch('/ceqr-invoice-questionnaires/:id');

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
