import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | user can interact with packages', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('User can visit view-only (show) package route', async function(assert) {
    const ourProject = this.server.create('project');
    const projectPackage = this.server.create('package', { project: ourProject });

    this.package = await this.owner.lookup('service:store').findRecord('package', projectPackage.id, { include: 'pas-form,project' });

    await visit('/packages/1');

    assert.equal(currentURL(), '/packages/1');
  });
});
