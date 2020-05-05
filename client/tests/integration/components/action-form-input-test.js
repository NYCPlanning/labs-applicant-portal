import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn, triggerEvent } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Integration | Component | action-form-input', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test('user-entered input is recorded on pasForm', async function(assert) {
    const projectPackage = this.server.create('package');

    this.package = await this.owner.lookup('service:store').findRecord('package', projectPackage.id, { include: 'pas-form' });

    this.actionField = 'dcpPfchangeincitymap';

    // Template block usage:
    await render(hbs`
    <ActionFormInput @pasForm={{this.package.pasForm}} @fieldType="number" @landUseActionField={{this.actionField}}/>
    `);

    assert.ok(!this.package.pasForm.dcpPfchangeincitymap);

    await fillIn('[data-test-input="dcpPfchangeincitymap"]', 4);
    await triggerEvent('[data-test-input="dcpPfchangeincitymap"]', 'keyup');

    assert.equal(this.package.pasForm.dcpPfchangeincitymap, 4);
  });
});
