import { module, test } from 'qunit';
import { visit, click, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | user can interact with packages', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('User can visit edit package route', async function(assert) {
    this.server.create('project', 1, 'applicant');

    await visit('/projects');
    await click('[data-test-project="edit-pas"]');

    assert.equal(currentURL(), '/packages/1/edit');
  });
});
