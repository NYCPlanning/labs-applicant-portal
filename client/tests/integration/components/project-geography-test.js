import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, fillIn } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import EmberObject from '@ember/object';

module('Integration | Component | project-geography', function(hooks) {
  setupRenderingTest(hooks);

  test('user can add a new bbl', async function(assert) {
    const ourModel = EmberObject.extend({});

    // array of objects
    // bbls array is dcp_dcp_projectbbl_dcp_pasform
    const pasFormModel = ourModel.create({
      dcp_pasformid: '09c0127a-415b-ea11-a9af-001dd83080ab',
      bbls: [
        ourModel.create({
          dcp_validatedlot: '0111',
          dcp_bblnumber: '3071590111',
          versionnumber: '42470724',
          dcp_partiallot: null,
          dcp_developmentsite: null,
        }),
        ourModel.create({
          dcp_validatedlot: '0115',
          dcp_bblnumber: '3071590115',
          versionnumber: '42470776',
          dcp_partiallot: null,
          dcp_developmentsite: null,
        }),
      ],
    });

    this.currentPasFormModel = pasFormModel;

    // Template block usage:
    await render(hbs`
      <ProjectGeography
        @pasForm={{this.currentPasFormModel}} />
    `);

    await fillIn('[data-test-input="bbl"]', '1001440001');

    await click('[data-test-button="add-bbl"]');

    assert.ok(this.element.textContent.includes('1001440001'));
  });

  test('user can remove a bbl', async function(assert) {
    const ourModel = EmberObject.extend({});

    // array of objects
    // bbls array is dcp_dcp_projectbbl_dcp_pasform
    const pasFormModel = ourModel.create({
      dcp_pasformid: '09c0127a-415b-ea11-a9af-001dd83080ab',
      bbls: [
        ourModel.create({
          dcp_validatedlot: '0111',
          dcp_bblnumber: '3071590111',
          versionnumber: '42470724',
          dcp_partiallot: null,
          dcp_developmentsite: null,
        }),
        ourModel.create({
          dcp_validatedlot: '0115',
          dcp_bblnumber: '3071590115',
          versionnumber: '42470776',
          dcp_partiallot: null,
          dcp_developmentsite: null,
        }),
      ],
    });

    this.set('currentPasFormModel', pasFormModel);

    // Template block usage:
    await render(hbs`
      <ProjectGeography
        @pasForm={{this.currentPasFormModel}} />
    `);

    await fillIn('[data-test-input="bbl"]', '1001440001');

    await click('[data-test-button="add-bbl"]');

    assert.ok(this.element.textContent.includes('3071590115'));
    assert.ok(this.element.textContent.includes('1001440001'));

    await click('[data-test-button-remove-bbl="1001440001"]');

    assert.ok(this.element.textContent.includes('3071590115'));
    assert.notOk(this.element.textContent.includes('1001440001'));

    await click('[data-test-button-remove-bbl="3071590115"]');

    assert.notOk(this.element.textContent.includes('3071590115'));
    assert.notOk(this.element.textContent.includes('1001440001'));
  });
});
