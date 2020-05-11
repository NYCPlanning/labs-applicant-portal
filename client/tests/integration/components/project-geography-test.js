import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  render,
  click,
  fillIn,
  triggerKeyEvent,
} from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Integration | Component | project-geography', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test('user can search and add new bbls', async function(assert) {
    // array of bbl objects is dcp_dcp_projectbbl_dcp_pasform
    this.server.create('bbl', {
      dcpBblnumber: '3071590111',
      dcpDevelopmentsite: null,
      dcpPartiallot: null,
    });

    this.server.create('bbl', {
      dcpBblnumber: '3071590115',
      dcpDevelopmentsite: null,
      dcpPartiallot: null,
    });

    this.bbls = [
      await this.owner.lookup('service:store').findRecord('bbl', 1),
      await this.owner.lookup('service:store').findRecord('bbl', 2),
    ];

    await render(hbs`
      <ProjectGeography
        @bbls={{this.bbls}} />
    `);

    // labs-ember-search class for search input
    await fillIn('.map-search-input', '1000120001');
    await triggerKeyEvent('.labs-geosearch', 'keypress', 13);

    assert.dom(this.element).includesText('1 Bowling Green, Manhattan');

    assert.dom('[data-test-bbl-title="1000120001"]').exists();

    // test that user can add more than one bbl
    await fillIn('.map-search-input', '1000030001');
    await triggerKeyEvent('.labs-geosearch', 'keypress', 13);

    assert.dom(this.element).includesText('10 Battery Park, Manhattan');

    assert.dom('[data-test-bbl-title="1000030001"]').exists();
  });

  test('user can remove a bbl', async function(assert) {
    // array of objects
    // bbls array is dcp_dcp_projectbbl_dcp_pasform
    this.server.create('bbl', {
      dcpBblnumber: '3071590111',
      dcpDevelopmentsite: null,
      dcpPartiallot: null,
    });

    this.server.create('bbl', {
      dcpBblnumber: '3071590115',
      dcpDevelopmentsite: null,
      dcpPartiallot: null,
    });

    this.bbls = [
      await this.owner.lookup('service:store').findRecord('bbl', 1),
      await this.owner.lookup('service:store').findRecord('bbl', 2),
    ];

    await render(hbs`
      <ProjectGeography
        @bbls={{this.bbls}} />
    `);

    // labs-ember-search class for search input
    await fillIn('.map-search-input', '1000120001');
    await triggerKeyEvent('.labs-geosearch', 'keypress', 13);

    assert.dom('[data-test-bbl-title="3071590115"]').exists();
    assert.dom('[data-test-bbl-title="1000120001"]').exists();

    await click('[data-test-button-remove-bbl="1000120001"]');

    assert.dom('[data-test-bbl-title="3071590115"]').exists();
    assert.dom('[data-test-bbl-title="1000120001"]').doesNotExist();

    await click('[data-test-button-remove-bbl="3071590115"]');

    assert.dom('[data-test-bbl-title="3071590115"]').doesNotExist();
    assert.dom('[data-test-bbl-title="1000120001"]').doesNotExist();
  });

  test('user can update dcpDevelopmentsite through the radio buttons', async function(assert) {
    // array of objects
    // bbls array is dcp_dcp_projectbbl_dcp_pasform
    this.server.create('bbl', {
      dcpBblnumber: '3071590111',
      dcpDevelopmentsite: null,
      dcpPartiallot: null,
    });

    this.server.create('bbl', {
      dcpBblnumber: '3071590115',
      dcpDevelopmentsite: null,
      dcpPartiallot: null,
    });

    this.bbls = [
      await this.owner.lookup('service:store').findRecord('bbl', 1),
      await this.owner.lookup('service:store').findRecord('bbl', 2),
    ];

    await render(hbs`
      <ProjectGeography
        @bbls={{this.bbls}} />
    `);

    // labs-ember-search class for search input
    await fillIn('.map-search-input', '1000120001');
    await triggerKeyEvent('.labs-geosearch', 'keypress', 13);

    // check that radio buttons work for bbl that already existed
    assert.dom('[data-test-development-site-question="3071590111-true"]').doesNotExist();
    assert.dom('[data-test-development-site-question="3071590111-false"]').doesNotExist();

    await click('[data-test-bbl-development-site-yes="3071590111"]');
    assert.dom('[data-test-development-site-question="3071590111-true"]').exists();
    assert.dom('[data-test-development-site-question="3071590111-false"]').doesNotExist();

    await click('[data-test-bbl-development-site-no="3071590111"]');
    assert.dom('[data-test-development-site-question="3071590111-true"]').doesNotExist();
    assert.dom('[data-test-development-site-question="3071590111-false"]').exists();

    // check that radio buttons work for user-added bbl
    assert.dom('[data-test-development-site-question="1000120001-true"]').doesNotExist();
    assert.dom('[data-test-development-site-question="1000120001-false"]').doesNotExist();

    await click('[data-test-bbl-development-site-yes="1000120001"]');
    assert.dom('[data-test-development-site-question="1000120001-true"]').exists();
    assert.dom('[data-test-development-site-question="1000120001-false"]').doesNotExist();

    await click('[data-test-bbl-development-site-no="1000120001"]');
    assert.dom('[data-test-development-site-question="1000120001-true"]').doesNotExist();
    assert.dom('[data-test-development-site-question="1000120001-false"]').exists();
  });

  test('user can update dcpPartiallot through the radio buttons', async function(assert) {
    // array of objects
    // bbls array is dcp_dcp_projectbbl_dcp_pasform
    this.server.create('bbl', {
      dcpBblnumber: '3071590111',
      dcpDevelopmentsite: null,
      dcpPartiallot: null,
    });

    this.server.create('bbl', {
      dcpBblnumber: '3071590115',
      dcpDevelopmentsite: null,
      dcpPartiallot: null,
    });

    this.bbls = [
      await this.owner.lookup('service:store').findRecord('bbl', 1),
      await this.owner.lookup('service:store').findRecord('bbl', 2),
    ];

    await render(hbs`
      <ProjectGeography
        @bbls={{this.bbls}} />
    `);

    // labs-ember-search class for search input
    await fillIn('.map-search-input', '1000120001');
    await triggerKeyEvent('.labs-geosearch', 'keypress', 13);

    // check that radio buttons work for bbl that already existed
    assert.dom('[data-test-partial-lot-question="3071590111-true"]').doesNotExist();
    assert.dom('[data-test-partial-lot-question="3071590111-false"]').doesNotExist();

    await click('[data-test-bbl-partial-lot-yes="3071590111"]');
    assert.dom('[data-test-partial-lot-question="3071590111-true"]').exists();
    assert.dom('[data-test-partial-lot-question="3071590111-false"]').doesNotExist();

    await click('[data-test-bbl-partial-lot-no="3071590111"]');
    assert.dom('[data-test-partial-lot-question="3071590111-true"]').doesNotExist();
    assert.dom('[data-test-partial-lot-question="3071590111-false"]').exists();

    // check that radio buttons work for user-added bbl
    assert.dom('[data-test-partial-lot-question="1000120001-true"]').doesNotExist();
    assert.dom('[data-test-partial-lot-question="1000120001-false"]').doesNotExist();

    await click('[data-test-bbl-partial-lot-yes="1000120001"]');
    assert.dom('[data-test-partial-lot-question="1000120001-true"]').exists();
    assert.dom('[data-test-partial-lot-question="1000120001-false"]').doesNotExist();

    await click('[data-test-bbl-partial-lot-no="1000120001"]');
    assert.dom('[data-test-partial-lot-question="1000120001-true"]').doesNotExist();
    assert.dom('[data-test-partial-lot-question="1000120001-false"]').exists();
  });

  test('user can create bbls and it serializes to validated bbl', async function (assert) {
    this.bbls = [];

    await render(hbs`
      <ProjectGeography
        @bbls={{this.bbls}} />
    `);

    await fillIn('.map-search-input', '1000120001');
    await triggerKeyEvent('.labs-geosearch', 'keypress', 13);

    assert.equal(this.bbls[0].dcpUserinputborough, 717170001);
  });
});
