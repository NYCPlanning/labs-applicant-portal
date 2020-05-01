import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { selectChoose } from 'ember-power-select/test-support';

module('Integration | Component | land-use-action', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test('Selecting an action from the dropdown sets the correct count', async function(assert) {
    const projectPackage = this.server.create('package');

    this.package = await this.owner.lookup('service:store').findRecord('package', projectPackage.id, { include: 'pas-form' });

    // Template block usage:
    await render(hbs`
      <LandUseAction @pasForm={{this.package.pasForm}}>
      </LandUseAction>
    `);

    // check that this attribute is falsey
    assert.ok(!this.package.pasForm.dcpPfzoningspecialpermit);

    await selectChoose('[data-test-land-use-action-picker]', 'Zoning Special Permit');

    assert.equal(this.package.pasForm.dcpPfzoningspecialpermit, 1);

    await selectChoose('[data-test-land-use-action-picker]', 'Zoning Special Permit');

    assert.equal(this.package.pasForm.dcpPfzoningspecialpermit, 2);
  });
});
