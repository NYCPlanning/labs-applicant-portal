import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | user can interact with packages', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('User can visit view-only (show) package route', async function(assert) {
    this.server.create('project', 1, 'applicant');

    await visit('/packages/1');

    assert.equal(currentURL(), '/packages/1');
  });
});
