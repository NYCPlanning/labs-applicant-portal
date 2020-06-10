import { module, test } from 'qunit';
import {
  visit,
  currentURL,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { authenticateSession } from 'ember-simple-auth/test-support';

module('Acceptance | user can click rwcds edit', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(() => {
    authenticateSession({
      emailaddress1: 'me@me.com',
    });
  });

  test('User can visit edit rwcds-form route', async function(assert) {
    this.server.create('project', 1, 'applicant');

    await visit('/rwcds-form/1/edit');

    assert.equal(currentURL(), '/rwcds-form/1/edit');
  });
});
