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

  test('User can add new actions and answer extra questions', async function(assert) {
    const projectPackage = this.server.create('package', 1, 'applicant', 'withLandUseActions');

    this.package = await this.owner.lookup('service:store').findRecord('package', projectPackage.id, { include: 'pas-form' });

    // Template block usage:
    await render(hbs`
      <LandUseAction @pasForm={{this.package.pasForm}}>
      </LandUseAction>
    `);

    assert.equal(this.package.pasForm.dcpPfzoningspecialpermit, undefined);

    await selectChoose('[data-test-land-use-action-picker]', 'Zoning Special Permit');
    await selectChoose('[data-test-land-use-action-picker]', 'Zoning Authorization');

    // Check that we can add "Zoning Special Permit" and "Zoning Authorization"
    assert.dom('[data-test-action-name="Zoning Special Permit"]').exists({ count: 1 });
    assert.dom('[data-test-action-name="Zoning Authorization"]').exists({ count: 1 });

    // Check that count field is set to 1 and that extra questions are not yet filled
    assert.equal(this.package.pasForm.dcpPfzoningspecialpermit, 1);
    assert.equal(this.package.pasForm.dcpZoningspecialpermitpursuantto, undefined);
    assert.equal(this.package.pasForm.dcpZoningspecialpermittomodify, undefined);
    assert.equal(this.package.pasForm.dcpPfzoningauthorization, 1);
    assert.equal(this.package.pasForm.dcpZoningauthorizationpursuantto, undefined);
    assert.equal(this.package.pasForm.dcpZoningauthorizationtomodify, undefined);

    // fill in count field for Zoning Special Permit
    await fillIn('[data-test-input="dcpPfzoningspecialpermit"]', 6);
    assert.equal(this.package.pasForm.dcpPfzoningspecialpermit, 6);
    // make sure that changing one count field input did not affect the other
    assert.equal(this.package.pasForm.dcpPfzoningauthorization, 1);
    // fill in count field for Zoning Authorization
    await fillIn('[data-test-input="dcpPfzoningauthorization"]', 4);
    assert.equal(this.package.pasForm.dcpPfzoningauthorization, 4);
    // make sure that changing one count field input did not affect the other
    assert.equal(this.package.pasForm.dcpPfzoningspecialpermit, 6);

    // check that user can fill in extra questions
    await fillIn('[data-test-input="dcpZoningspecialpermitpursuantto"]', 'Section 5B');
    assert.equal(this.package.pasForm.dcpZoningspecialpermitpursuantto, 'Section 5B');
    await fillIn('[data-test-input="dcpZoningspecialpermittomodify"]', 'Permit 7A');
    assert.equal(this.package.pasForm.dcpZoningspecialpermittomodify, 'Permit 7A');
  });

  test('User can delete actions', async function(assert) {
    const projectPackage = this.server.create('package', 1, 'applicant', 'withLandUseActions');

    this.package = await this.owner.lookup('service:store').findRecord('package', projectPackage.id, { include: 'pas-form' });

    // Template block usage:
    await render(hbs`
      <LandUseAction @pasForm={{this.package.pasForm}}>
      </LandUseAction>
    `);

    // Check that user can delete action loaded from db, "Change in CityMap"
    assert.equal(this.package.pasForm.dcpPfchangeincitymap, 1);
    await click('[data-test-delete-button="Change in CityMap"]');
    assert.equal(this.package.pasForm.dcpPfchangeincitymap, 0);
    assert.dom('[data-test-action-name="Change in CityMap"]').doesNotExist();

    // Check that user can delete "Zoning Special Permit" after adding
    await selectChoose('[data-test-land-use-action-picker]', 'Zoning Special Permit');

    await fillIn('[data-test-input="dcpPfzoningspecialpermit"]', 6);

    assert.equal(this.package.pasForm.dcpPfzoningspecialpermit, 6);

    await fillIn('[data-test-input="dcpZoningspecialpermitpursuantto"]', 'Section 5B');

    assert.equal(this.package.pasForm.dcpZoningspecialpermitpursuantto, 'Section 5B');

    await fillIn('[data-test-input="dcpZoningspecialpermittomodify"]', 'Permit 7A');

    assert.equal(this.package.pasForm.dcpZoningspecialpermittomodify, 'Permit 7A');

    await click('[data-test-delete-button="Zoning Special Permit"]');

    assert.dom('[data-test-action-name="Zoning Special Permit"]').doesNotExist();
    assert.equal(this.package.pasForm.dcpPfzoningspecialpermit, 0);
    assert.equal(this.package.pasForm.dcpZoningspecialpermitpursuantto, '');
    assert.equal(this.package.pasForm.dcpZoningspecialpermittomodify, '');
  });

  test('User can load PAS Form with existing Land Use Actions', async function(assert) {
    const projectPackage = this.server.create('package', 1, 'applicant', 'withLandUseActions');

    this.package = await this.owner.lookup('service:store').findRecord('package', projectPackage.id, { include: 'pas-form' });

    // Template block usage:
    await render(hbs`
      <LandUseAction @pasForm={{this.package.pasForm}}>
      </LandUseAction>
    `);

    assert.dom('[data-test-action-name="Change in CityMap"]').exists({ count: 1 });
    assert.dom('[data-test-action-name="Zoning Certification"]').exists({ count: 1 });
    assert.dom('[data-test-action-name="Zoning Text Amendment"]').exists({ count: 1 });

    assert.dom('[data-test-input="dcpPfzoningcertification"]').hasValue('21');
    assert.dom('[data-test-input="dcpZoningpursuantto"]').hasValue('some value');
    assert.dom('[data-test-input="dcpZoningtomodify"]').hasValue('some other val');
    assert.dom('[data-test-input="dcpAffectedzrnumber"]').hasNoValue();
    assert.dom('[data-test-input="dcpZoningresolutiontitle"]').hasNoValue();
  });

  test('Issue #235 Bug: Updating action inputs does not cause actions to show up twice', async function(assert) {
    const projectPackage = this.server.create('package', 1, 'applicant', 'withLandUseActions');

    this.package = await this.owner.lookup('service:store').findRecord('package', projectPackage.id, { include: 'pas-form' });

    // Template block usage:
    await render(hbs`
      <LandUseAction @pasForm={{this.package.pasForm}}>
      </LandUseAction>
    `);

    await selectChoose('[data-test-land-use-action-picker]', 'Zoning Special Permit');

    // check that only one input exists
    assert.dom('[data-test-input="dcpZoningspecialpermitpursuantto"]').exists({ count: 1 });

    await fillIn('[data-test-input="dcpZoningspecialpermitpursuantto"]', 'Section 5B');

    // check that setting field on the model did NOT add another instance of the action to the UI
    assert.dom('[data-test-input="dcpZoningspecialpermitpursuantto"]').exists({ count: 1 });

    // user removes text
    await fillIn('[data-test-input="dcpZoningspecialpermitpursuantto"]', '');

    assert.dom('[data-test-input="dcpPfzoningspecialpermit"]').exists({ count: 1 });

    // check that only one input exists
    await fillIn('[data-test-input="dcpPfzoningspecialpermit"]', 6);

    // check that setting field on the model did NOT add another instance of the action to the UI
    assert.dom('[data-test-input="dcpPfzoningspecialpermit"]').exists({ count: 1 });
  });
});
