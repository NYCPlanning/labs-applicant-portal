import { module, test } from 'qunit';
import {
  visit,
  click,
  currentURL,
  settled,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { authenticateSession } from 'ember-simple-auth/test-support';

module('Acceptance | user can click package edit', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(() => {
    authenticateSession({
      emailaddress1: 'me@me.com',
    });
  });

  test('User can visit edit package route', async function(assert) {
    this.server.create('project', 1, 'applicant');

    await visit('/projects');
    await click('[data-test-project="edit-pas"]');

    assert.equal(currentURL(), '/packages/1/edit');
  });

  test('User can visit save and submit package', async function (assert) {
    this.server.create('project', 1, 'applicant');

    await visit('/projects');
    await click('[data-test-project="edit-pas"]');
    await click('[data-test-save-button]');
    await click('[data-test-submit-button]');
    await click('[data-test-confirm-submit-button]');

    // for some reason promises aren't being captured so we await for settled state
    await settled();

    assert.equal(currentURL(), '/packages/1');
  });
});
