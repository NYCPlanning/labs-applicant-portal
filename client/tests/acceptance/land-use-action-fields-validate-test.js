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

  test.skip('validation message appears for count field when user types incorrect value', async function(assert) {
    this.server.create('package', 'pasForm', {
      project: this.server.create('project'),
    });

    await visit('/pas-form/1/edit');

    await selectChoose('[data-test-land-use-action-picker]', 'Zoning Authorization');

    assert.dom('[data-test-validation-message="dcpPfzoningauthorization"]').doesNotExist();

    await fillIn('[data-test-input="dcpPfzoningauthorization"]', '-1');

    assert.dom('[data-test-validation-message="dcpPfzoningauthorization"]').hasText('Number of actions must be greater than 0');

    await fillIn('[data-test-input="dcpPfzoningauthorization"]', '0');

    assert.dom('[data-test-validation-message="dcpPfzoningauthorization"]').hasText('Number of actions must be greater than 0');

    await fillIn('[data-test-input="dcpPfzoningauthorization"]', '');

    assert.dom('[data-test-validation-message="dcpPfzoningauthorization"]').hasText('Number of actions must be greater than 0');

    await fillIn('[data-test-input="dcpPfzoningauthorization"]', '2');

    assert.dom('[data-test-validation-message="dcpPfzoningauthorization"]').doesNotExist();
  });

  test.skip('validation message appears for extra questions when user types incorrect value', async function(assert) {
    this.server.create('package', 'pasForm', {
      project: this.server.create('project'),
    });

    // representation of input that is 1 over the maximum character limit
    const maximum = (maxLength, singleCharacter) => singleCharacter.repeat(maxLength) + singleCharacter;

    await visit('/pas-form/1/edit');

    assert.dom('[data-test-validation-message="dcpZoningauthorizationpursuantto"]').doesNotExist();
    assert.dom('[data-test-validation-message="dcpZoningauthorizationtomodify"]').doesNotExist();

    // Zoning Authorization
    await selectChoose('[data-test-land-use-action-picker]', 'Zoning Authorization');
    assert.dom('[data-test-validation-message="dcpZoningauthorizationpursuantto"]').hasText('This field is required');
    assert.dom('[data-test-validation-message="dcpZoningauthorizationtomodify"]').hasText('This field is required');
    // check that an empty string value for dcpPfzoningauthorization still "requires" the extra fields
    await fillIn('[data-test-input="dcpPfzoningauthorization"]', '');
    assert.dom('[data-test-validation-message="dcpZoningauthorizationpursuantto"]').hasText('This field is required');
    assert.dom('[data-test-validation-message="dcpZoningauthorizationtomodify"]').hasText('This field is required');

    // dcpZoningauthorizationpursuantto text length
    await fillIn('[data-test-input="dcpZoningauthorizationpursuantto"]', maximum(250, 'a'));
    assert.dom('[data-test-validation-message="dcpZoningauthorizationpursuantto"]').hasText('Text is too long (max 250 characters)');
    await fillIn('[data-test-input="dcpZoningauthorizationpursuantto"]', 'Section 5');
    assert.dom('[data-test-validation-message="dcpZoningauthorizationpursuantto"]').doesNotExist();

    // dcpZoningauthorizationtomodify text length
    await fillIn('[data-test-input="dcpZoningauthorizationtomodify"]', maximum(250, 'a'));
    assert.dom('[data-test-validation-message="dcpZoningauthorizationtomodify"]').hasText('Text is too long (max 250 characters)');
    await fillIn('[data-test-input="dcpZoningauthorizationtomodify"]', 'Section B');
    assert.dom('[data-test-validation-message="dcpZoningauthorizationtomodify"]').doesNotExist();

    // Renewal
    await selectChoose('[data-test-land-use-action-picker]', 'Renewal');
    assert.dom('[data-test-validation-message="dcpPreviousulurpnumbers2"]').hasText('This field is required');
    await fillIn('[data-test-input="dcpPreviousulurpnumbers2"]', maximum(100, '5'));
    assert.dom('[data-test-validation-message="dcpPreviousulurpnumbers2"]').hasText('Text is too long (max 100 characters)');
    await fillIn('[data-test-input="dcpPreviousulurpnumbers2"]', 55555);
    assert.dom('[data-test-validation-message="dcpPreviousulurpnumbers2"]').doesNotExist();
  });
});
