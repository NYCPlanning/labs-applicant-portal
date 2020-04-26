import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  render,
  click,
  fillIn,
  triggerKeyEvent,
  find,
} from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | project-geography', function(hooks) {
  setupRenderingTest(hooks);

  test('user can search and add a new bbl', async function(assert) {
    // array of objects
    // bbls array is dcp_dcp_projectbbl_dcp_pasform
    const pasFormModel = {
      dcp_pasformid: '09c0127a-415b-ea11-a9af-001dd83080ab',
      bbls: [
        {
          dcp_validatedlot: '0111',
          dcp_bblnumber: '3071590111',
          versionnumber: '42470724',
          dcp_partiallot: null,
          dcp_developmentsite: null,
        },
        {
          dcp_validatedlot: '0115',
          dcp_bblnumber: '3071590115',
          versionnumber: '42470776',
          dcp_partiallot: null,
          dcp_developmentsite: null,
        },
      ],
    };

    this.currentPasFormModel = pasFormModel;

    await render(hbs`
      <ProjectGeography
        @pasForm={{this.currentPasFormModel}} />
    `);

    // labs-ember-search class for search input
    await fillIn('.map-search-input', '1000120001');
    await triggerKeyEvent('.labs-geosearch', 'keypress', 13);

    assert.ok(find('[data-test-bbl-link="1000120001"]'));

    await fillIn('.map-search-input', '1000030001');
    await triggerKeyEvent('.labs-geosearch', 'keypress', 13);

    assert.ok(find('[data-test-bbl-link="1000030001"]'));
  });

  test('user can remove a bbl', async function(assert) {
    // array of objects
    // bbls array is dcp_dcp_projectbbl_dcp_pasform
    const pasFormModel = {
      dcp_pasformid: '09c0127a-415b-ea11-a9af-001dd83080ab',
      bbls: [
        {
          dcp_validatedlot: '0111',
          dcp_bblnumber: '3071590111',
          versionnumber: '42470724',
          dcp_partiallot: null,
          dcp_developmentsite: null,
        },
        {
          dcp_validatedlot: '0115',
          dcp_bblnumber: '3071590115',
          versionnumber: '42470776',
          dcp_partiallot: null,
          dcp_developmentsite: null,
        },
      ],
    };

    this.set('currentPasFormModel', pasFormModel);

    // Template block usage:
    await render(hbs`
      <ProjectGeography
        @pasForm={{this.currentPasFormModel}} />
    `);

    // labs-ember-search class for search input
    await fillIn('.map-search-input', '1000120001');
    await triggerKeyEvent('.labs-geosearch', 'keypress', 13);

    assert.ok(find('[data-test-bbl-link="3071590115"]'));
    assert.ok(find('[data-test-bbl-link="1000120001"]'));

    await click('[data-test-button-remove-bbl="1000120001"]');

    assert.ok(find('[data-test-bbl-link="3071590115"]'));
    assert.notOk(find('[data-test-bbl-link="1000120001"]'));

    await click('[data-test-button-remove-bbl="3071590115"]');

    assert.notOk(find('[data-test-bbl-link="3071590115"]'));
    assert.notOk(find('[data-test-bbl-link="1000120001"]'));
  });
});
