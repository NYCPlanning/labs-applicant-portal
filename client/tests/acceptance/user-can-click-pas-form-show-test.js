import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { authenticateSession } from 'ember-simple-auth/test-support';

module('Acceptance | user can interact with pas-form packages', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(() => {
    authenticateSession({
      emailaddress1: 'me@me.com',
    });
  });

  test('User can visit view-only (show) pas-form route', async function(assert) {
    const ourProject = this.server.create('project');
    const projectPackage = this.server.create('package', { project: ourProject });

    this.package = await this.owner.lookup('service:store').findRecord('package', projectPackage.id, { include: 'pas-form,project' });

    await visit('/pas-form/1');

    assert.equal(currentURL(), '/pas-form/1');
  });
});
