import { module, test } from 'qunit';
import {
  visit,
  click,
  settled,
  fillIn,
  currentURL,
  waitFor,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { authenticateSession } from 'ember-simple-auth/test-support';
import { selectFiles } from 'ember-file-upload/test-support';

module('Acceptance | error message appears when save fails', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(() => {
    authenticateSession({
      emailaddress1: 'me@me.com',
    });
  });

  test('error message appears when error occurs on save for PAS Form', async function(assert) {
    this.server.create('package', 'pasForm', {
      project: this.server.create('project'),
    });

    this.server.patch('/pas-forms/:id', { errors: [{ detail: 'server problem with pasForm' }] }, 500); // force mirage to error

    await visit('/pas-form/1/edit');

    assert.dom('[data-test-error-message]').doesNotExist();

    await fillIn('[data-test-input="dcpRevisedprojectname"]', 'Some Cool New Project Name');

    // save it
    await click('[data-test-save-button]');
    await settled(); // async make sure save action finishes before assertion

    await waitFor('[data-test-error-message]');

    assert.dom('[data-test-error-message]').exists();
    assert.dom('[data-test-error-message]').includesText('server problem with pasForm');

    // check that model was not saved
    assert.equal(this.server.db.pasForms[0].dcpRevisedprojectname, undefined);
  });

  test('error message appears when error occurs on save for RWCDS Form', async function(assert) {
    this.server.create('package', 'rwcdsForm', {
      project: this.server.create('project'),
    });

    this.server.patch('/rwcds-forms/:id', { errors: [{ detail: 'server problem with rwcdsForm' }] }, 500); // force mirage to error

    await visit('/rwcds-form/1/edit');

    assert.dom('[data-test-error-message]').doesNotExist();

    await fillIn('[data-test-textarea="dcpProjectsitedescription"]', 'Whatever affects one directly, affects all indirectly.');

    // save it
    await click('[data-test-save-button]');
    await settled(); // async make sure save action finishes before assertion

    await waitFor('[data-test-error-message]');

    assert.dom('[data-test-error-message]').exists();
    assert.dom('[data-test-error-message]').includesText('server problem with rwcdsForm');

    // check that model was not saved
    assert.equal(this.server.db.rwcdsForms[0].dcpProjectsitedescription, undefined);
  });

  test('error message appears when error occurs on file upload', async function(assert) {
    this.server.create('package', 'applicant', {
      documents: [],
      project: this.server.create('project', 'applicant'),
      pasForm: this.server.create('pas-form', {
        dcpRevisedprojectname: 'my project name',
      }),
    });

    this.server.patch('/packages/:id', { errors: [{ detail: 'server problem with package' }] }, 500); // force mirage to error

    await visit('/pas-form/2/edit');

    assert.dom('[data-test-error-message]').doesNotExist();

    const file = new File(['foo'], 'Zoning Application.pdf', { type: 'text/plain' });
    await selectFiles('#FileUploader2 > input', file);

    // save it
    await click('[data-test-save-button]');
    await settled(); // async make sure save action finishes before assertion

    await waitFor('[data-test-error-message]');

    assert.dom('[data-test-error-message]').exists();
    assert.dom('[data-test-error-message]').includesText('server problem with package');

    // check that model was not saved
    assert.equal(this.server.db.packages[1].documents.length, 0);
  });

  test('error message appears when error occurs on submit', async function(assert) {
    // all required fields are filled for submitting
    this.server.create('package', {
      dcpPackagetype: 717170000,
      project: this.server.create('project'),
      pasForm: this.server.create('pas-form', {
        dcpRevisedprojectname: 'project name',
        applicants: [
          this.server.create('applicant', {
            dcpFirstname: 'first name',
            dcpLastname: 'last name',
            dcpEmail: 'email',
            dcpType: '717170000',
          }),
        ],
      }),
    });

    this.server.patch('/pas-forms/:id', { errors: [{ detail: 'server problem with pasForm' }] }, 500); // force mirage to error

    await visit('/pas-form/1/edit');

    assert.dom('[data-test-error-message]').doesNotExist();

    await click('[data-test-submit-button]');
    await click('[data-test-confirm-submit-button]');

    await waitFor('[data-test-error-message]');

    assert.dom('[data-test-error-message]').exists();
    assert.dom('[data-test-error-message]').includesText('server problem with pasForm');

    // make sure route did not transition
    assert.equal(currentURL(), '/pas-form/1/edit');
  });
});
