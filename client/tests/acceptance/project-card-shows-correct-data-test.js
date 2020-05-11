import { module, test } from 'qunit';
import { visit, findAll } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { authenticateSession } from 'ember-simple-auth/test-support';

module('Acceptance | project card shows correct data', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(() => {
    authenticateSession({
      emailaddress1: 'me@me.com',
    });
  });

  test('Shows correct project status', async function(assert) {
    // 4 default applicant projects that with Active statuscode
    this.server.createList('project', 4, 'applicant');

    // 2 on hold projects
    this.server.createList('project', 2, 'applicant', 'onHold');

    await visit('/projects');

    // should only have 2 On Hold spans
    assert.equal(findAll('[data-test-project-on-hold]').length, 2);
  });
});
