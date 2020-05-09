import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  render,
  fillIn,
  click,
} from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { selectChoose } from 'ember-power-select/test-support';

module('Integration | Component | land-use-action', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test('User can edit an existing action, add a new action, and answer extra questions', async function(assert) {
    const projectPackage = this.server.create('package', 1, 'applicant', 'withLandUseActions');

    this.package = await this.owner.lookup('service:store').findRecord('package', projectPackage.id, { include: 'pas-form' });

    // Template block usage:
    await render(hbs`
      <LandUseAction @pasForm={{this.package.pasForm}}>
      </LandUseAction>
    `);

    // Check that we can edit "Change in CityMap"
    assert.dom(this.element).includesText('How many Change in CityMap actions?');

    assert.equal(this.package.pasForm.dcpPfchangeincitymap, 4);

    await fillIn('[data-test-input="dcpPfchangeincitymap"]', 2);

    assert.equal(this.package.pasForm.dcpPfchangeincitymap, 2);

    // Check that we can add "Zoning Special Permit" and answer extra questions
    await selectChoose('[data-test-land-use-action-picker]', 'Zoning Special Permit');

    assert.dom(this.element).includesText('How many Zoning Special Permit actions?');
    assert.dom(this.element).includesText('Where in the Zoning Resolution can this action be found?');
    assert.dom(this.element).includesText('Which sections of the Zoning Resolution does this modify?');

    assert.ok(!this.package.pasForm.dcpPfzoningspecialpermit);
    assert.ok(!this.package.pasForm.dcpZoningspecialpermitpursuantto);
    assert.ok(!this.package.pasForm.dcpZoningspecialpermittomodify);

    await fillIn('[data-test-input="dcpPfzoningspecialpermit"]', 6);

    assert.equal(this.package.pasForm.dcpPfzoningspecialpermit, 6);

    await fillIn('[data-test-input="dcpZoningspecialpermitpursuantto"]', 'Section 5B');

    assert.equal(this.package.pasForm.dcpZoningspecialpermitpursuantto, 'Section 5B');

    await fillIn('[data-test-input="dcpZoningspecialpermittomodify"]', 'Permit 7A');

    assert.equal(this.package.pasForm.dcpZoningspecialpermittomodify, 'Permit 7A');
  });

  test('User can delete an action', async function(assert) {
    const projectPackage = this.server.create('package');

    this.package = await this.owner.lookup('service:store').findRecord('package', projectPackage.id, { include: 'pas-form' });

    // Template block usage:
    await render(hbs`
      <LandUseAction @pasForm={{this.package.pasForm}}>
      </LandUseAction>
    `);

    // Check that user can delete "Zoning Special Permit"
    await selectChoose('[data-test-land-use-action-picker]', 'Zoning Special Permit');

    await fillIn('[data-test-input="dcpPfzoningspecialpermit"]', 6);

    assert.equal(this.package.pasForm.dcpPfzoningspecialpermit, 6);

    await fillIn('[data-test-input="dcpZoningspecialpermitpursuantto"]', 'Section 5B');

    assert.equal(this.package.pasForm.dcpZoningspecialpermitpursuantto, 'Section 5B');

    await fillIn('[data-test-input="dcpZoningspecialpermittomodify"]', 'Permit 7A');

    assert.equal(this.package.pasForm.dcpZoningspecialpermittomodify, 'Permit 7A');

    await click('[data-test-delete-button="Zoning Special Permit"]');

    assert.equal(this.package.pasForm.dcpPfzoningspecialpermit, 0);
    assert.equal(this.package.pasForm.dcpZoningspecialpermitpursuantto, '');
    assert.equal(this.package.pasForm.dcpZoningspecialpermittomodify, '');
  });

  test('User can load PAS Form with existing Land Use Actions', async function(assert) {
    const projectPackage = this.server.create('package', 'applicant', 'withLandUseActions');

    this.package = await this.owner.lookup('service:store').findRecord('package', projectPackage.id, { include: 'pas-form' });

    // Template block usage:
    await render(hbs`
      <LandUseAction @pasForm={{this.package.pasForm}}>
      </LandUseAction>
    `);

    assert.dom('[data-test-input="dcpPfzoningcertification"]').hasValue('21');
    assert.dom('[data-test-input="dcpZoningpursuantto"]').hasValue('some value');
    assert.dom('[data-test-input="dcpZoningtomodify"]').hasValue('some other val');
    assert.dom('[data-test-input="dcpPfzoningtextamendment"]').hasValue('2');
    assert.dom('[data-test-input="dcpAffectedzrnumber"]').hasNoValue();
    assert.dom('[data-test-input="dcpZoningresolutiontitle"]').hasNoValue();
    assert.dom('[data-test-input="dcpPfchangeincitymap"]').hasValue('4');
  });
});
