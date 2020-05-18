import { module, test } from 'qunit';
import {
  visit,
  fillIn,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { authenticateSession } from 'ember-simple-auth/test-support';
import { selectChoose } from 'ember-power-select/test-support';

module('Acceptance | land use action fields validate', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(() => {
    authenticateSession({
      emailaddress1: 'me@me.com',
    });
  });

  test('validation message appears for count field when user types incorrect value', async function(assert) {
    this.server.create('package', {
      project: this.server.create('project'),
      pasForm: this.server.create('pas-form'),
    });

    await visit('/packages/1/edit');

    await selectChoose('[data-test-land-use-action-picker]', 'Zoning Authorization');

    assert.dom('[data-test-validation-message="Number of actions must be greater than 0."]').doesNotExist();

    await fillIn('[data-test-input="dcpPfzoningauthorization"]', '-1');

    assert.dom('[data-test-validation-message="Number of actions must be greater than 0."]').exists();

    await fillIn('[data-test-input="dcpPfzoningauthorization"]', '0');

    assert.dom('[data-test-validation-message="Number of actions must be greater than 0."]').exists();

    await fillIn('[data-test-input="dcpPfzoningauthorization"]', '');

    assert.dom('[data-test-validation-message="Number of actions must be greater than 0."]').exists();

    await fillIn('[data-test-input="dcpPfzoningauthorization"]', '2');

    assert.dom('[data-test-validation-message="Number of actions must be greater than 0."]').doesNotExist();
  });

  test('validation message appears for extra questions when user types incorrect value', async function(assert) {
    this.server.create('package', {
      project: this.server.create('project'),
      pasForm: this.server.create('pas-form'),
    });

    await visit('/packages/1/edit');

    assert.dom('[data-test-validation-message="This field is required."]').doesNotExist();

    // Zoning Authorization
    await selectChoose('[data-test-land-use-action-picker]', 'Zoning Authorization');
    assert.dom('[data-test-validation-message="This field is required"]').exists({ count: 2 });
    await fillIn('[data-test-input="dcpPfzoningauthorization"]', '');
    assert.dom('[data-test-validation-message="This field is required"]').exists({ count: 2 });
    await fillIn('[data-test-input="dcpZoningauthorizationpursuantto"]', 'Section 5');
    assert.dom('[data-test-validation-message="This field is required"]').exists({ count: 1 });
    await fillIn('[data-test-input="dcpZoningauthorizationtomodify"]', 'Section B');
    assert.dom('[data-test-validation-message="This field is required"]').doesNotExist();

    // Renewal
    await selectChoose('[data-test-land-use-action-picker]', 'Renewal');
    assert.dom('[data-test-validation-message="This field is required"]').exists({ count: 1 });
    await fillIn('[data-test-input="dcpPreviousulurpnumbers2"]', '7777777');
    assert.dom('[data-test-validation-message="This field is required"]').doesNotExist();
  });
});
