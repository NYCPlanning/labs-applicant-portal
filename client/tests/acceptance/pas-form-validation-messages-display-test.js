import { module, test } from 'qunit';
import {
  visit,
  fillIn,
  click,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { authenticateSession } from 'ember-simple-auth/test-support';
import exceedMaximum from '../helpers/exceed-maximum-characters';

module('Acceptance | pas form validation messages display', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(() => {
    authenticateSession({
      emailaddress1: 'me@me.com',
    });
  });

  test('Certain fields display both Saveable and Submittable validation errors', async function(assert) {
    this.server.create('package', 'pasForm', {
      project: this.server.create('project'),
    });

    await visit('/pas-form/1/edit');

    assert.dom('[data-test-submit-button]').hasAttribute('disabled');
    assert.dom('[data-test-save-button]').hasAttribute('disabled');

    // dcpRevisedprojectname (length limits and presence required)
    assert.dom('[data-test-validation-message="dcpRevisedprojectname"]').hasText('This field is required');
    await fillIn('[data-test-input="dcpRevisedprojectname"]', 'abc');
    // save button should NOT be disabled because dcpRevisedprojectname exists and length is correct
    assert.dom('[data-test-save-button]').hasNoAttribute('disabled');
    assert.dom('[data-test-validation-message="dcpRevisedprojectname"]').doesNotExist();
    await fillIn('[data-test-input="dcpRevisedprojectname"]', exceedMaximum(50, 'String'));
    assert.dom('[data-test-validation-message="dcpRevisedprojectname"]').hasText('Text is too long (max 50 characters)');
    // save button SHOULD be disabled because dcpRevisedprojectname has incorrect length
    assert.dom('[data-test-save-button]').hasAttribute('disabled');

    // dcpDescriptionofprojectareageography (length limits)
    assert.dom('[data-test-validation-message="dcpDescriptionofprojectareageography"]').doesNotExist();
    await fillIn('[data-test-textarea="dcpDescriptionofprojectareageography"]', exceedMaximum(2000, 'String'));
    assert.dom('[data-test-validation-message="dcpDescriptionofprojectareageography"]').exists();
    await fillIn('[data-test-textarea="dcpDescriptionofprojectareageography"]', 'my short description');
    assert.dom('[data-test-validation-message="dcpDescriptionofprojectareageography"]').doesNotExist();

    // dcpUrbanareaname (length limits and presence required in certain conditions)
    assert.dom('[data-test-validation-message="dcpUrbanareaname"]').doesNotExist();
    // dcpUrbanareaname required if...
    await click('[data-test-radio="dcpUrbanrenewalarea"][data-test-radio-option="Yes"]');
    assert.dom('[data-test-validation-message="dcpUrbanareaname"]').hasText('This field is required');
    await fillIn('[data-test-input="dcpUrbanareaname"]', 'abc');
    assert.dom('[data-test-validation-message="dcpUrbanareaname"]').doesNotExist();
    await fillIn('[data-test-input="dcpUrbanareaname"]', exceedMaximum(250, 'String'));
    assert.dom('[data-test-validation-message="dcpUrbanareaname"]').hasText('Text is too long (max 250 characters)');
    await fillIn('[data-test-input="dcpUrbanareaname"]', 'my short description');
    assert.dom('[data-test-validation-message="dcpUrbanareaname"]').doesNotExist();

    // dcpPleaseexplaintypeiienvreview (length limits and presence required in certain conditions)
    assert.dom('[data-test-validation-message="dcpPleaseexplaintypeiienvreview"]').doesNotExist();
    // dcpPleaseexplaintypeiienvreview required if...
    await click('[data-test-radio="dcpLanduseactiontype2"][data-test-radio-option="Yes"]');
    assert.dom('[data-test-validation-message="dcpPleaseexplaintypeiienvreview"]').hasText('This field is required');
    await fillIn('[data-test-input="dcpPleaseexplaintypeiienvreview"]', 'abc');
    assert.dom('[data-test-validation-message="dcpPleaseexplaintypeiienvreview"]').doesNotExist();
    await fillIn('[data-test-input="dcpPleaseexplaintypeiienvreview"]', exceedMaximum(200, 'String'));
    assert.dom('[data-test-validation-message="dcpPleaseexplaintypeiienvreview"]').hasText('Text is too long (max 200 characters)');

    // dcpProjectareaindutrialzonename (length limits and presence required in certain conditions)
    assert.dom('[data-test-validation-message="dcpProjectareaindutrialzonename"]').doesNotExist();
    // dcpProjectareaindutrialzonename required if...
    await click('[data-test-radio="dcpProjectareaindustrialbusinesszone"][data-test-radio-option="Yes"]');
    assert.dom('[data-test-validation-message="dcpProjectareaindutrialzonename"]').hasText('This field is required');
    await fillIn('[data-test-input="dcpProjectareaindutrialzonename"]', 'abc');
    assert.dom('[data-test-validation-message="dcpProjectareaindutrialzonename"]').doesNotExist();
    await fillIn('[data-test-input="dcpProjectareaindutrialzonename"]', exceedMaximum(250, 'String'));
    assert.dom('[data-test-validation-message="dcpProjectareaindutrialzonename"]').hasText('Text is too long (max 250 characters)');

    // dcpProjectarealandmarkname (length limits and presence required in certain conditions)
    assert.dom('[data-test-validation-message="dcpProjectarealandmarkname"]').doesNotExist();
    // dcpProjectarealandmarkname required if...
    await click('[data-test-radio="dcpIsprojectarealandmark"][data-test-radio-option="Yes"]');
    assert.dom('[data-test-validation-message="dcpProjectarealandmarkname"]').hasText('This field is required');
    await fillIn('[data-test-input="dcpProjectarealandmarkname"]', 'abc');
    assert.dom('[data-test-validation-message="dcpProjectarealandmarkname"]').doesNotExist();
    await fillIn('[data-test-input="dcpProjectarealandmarkname"]', exceedMaximum(250, 'String'));
    assert.dom('[data-test-validation-message="dcpProjectarealandmarkname"]').hasText('Text is too long (max 250 characters)');

    // dcpHousingunittype (presence required in certain conditions)
    assert.dom('[data-test-validation-message="dcpHousingunittype"]').doesNotExist();
    // dcpHousingunittype required if...
    await click('[data-test-radio="dcpDiscressionaryfundingforffordablehousing"][data-test-radio-option="Yes"]');
    assert.dom('[data-test-validation-message="dcpHousingunittype"]').hasText('This field is required');
    await click('[data-test-radio="dcpHousingunittype"][data-test-radio-option="City"]');
    assert.dom('[data-test-validation-message="dcpHousingunittype"]').doesNotExist();

    // dcpCityregisterfilenumber (length limits)
    assert.dom('[data-test-validation-message="dcpCityregisterfilenumber"]').doesNotExist();
    await click('[data-test-radio="dcpRestrictivedeclaration"][data-test-radio-option="Yes"]');
    assert.dom('[data-test-validation-message="dcpCityregisterfilenumber"]').doesNotExist();
    await fillIn('[data-test-input="dcpCityregisterfilenumber"]', exceedMaximum(25, 'Number'));
    assert.dom('[data-test-validation-message="dcpCityregisterfilenumber"]').exists();
    await fillIn('[data-test-input="dcpCityregisterfilenumber"]', '555555');
    assert.dom('[data-test-validation-message="dcpCityregisterfilenumber"]').doesNotExist();

    // dcpEstimatedcompletiondate (length limits)
    assert.dom('[data-test-validation-message="dcpEstimatedcompletiondate"]').doesNotExist();
    await fillIn('[data-test-input="dcpEstimatedcompletiondate"]', '12345');
    assert.dom('[data-test-validation-message="dcpEstimatedcompletiondate"]').hasText('Please enter a valid year in YYYY format');
    await fillIn('[data-test-input="dcpEstimatedcompletiondate"]', '2005');
    assert.dom('[data-test-validation-message="dcpEstimatedcompletiondate"]').doesNotExist();

    // dcpProjectdescriptionproposeddevelopment (length limits)
    assert.dom('[data-test-validation-message="dcpEstimatedcompletiondate"]').doesNotExist();
    await fillIn('[data-test-textarea="dcpProjectdescriptionproposeddevelopment"]', exceedMaximum(3000, 'String'));
    assert.dom('[data-test-validation-message="dcpProjectdescriptionproposeddevelopment"]').exists('Text is too long (max 3000 characters)');
    await fillIn('[data-test-textarea="dcpProjectdescriptionproposeddevelopment"]', 'abc');
    assert.dom('[data-test-validation-message="dcpProjectdescriptionproposeddevelopment"]').doesNotExist();

    // dcpProjectdescriptionbackground (length limits)
    assert.dom('[data-test-validation-message="dcpProjectdescriptionbackground"]').doesNotExist();
    await fillIn('[data-test-textarea="dcpProjectdescriptionbackground"]', exceedMaximum(2000, 'String'));
    assert.dom('[data-test-validation-message="dcpProjectdescriptionbackground"]').hasText('Text is too long (max 2000 characters)');
    await fillIn('[data-test-textarea="dcpProjectdescriptionbackground"]', 'abc');
    assert.dom('[data-test-validation-message="dcpProjectdescriptionproposeddevelopment"]').doesNotExist();

    // dcpProjectdescriptionproposedactions (length limits)
    assert.dom('[data-test-validation-message="dcpProjectdescriptionproposedactions"]').doesNotExist();
    await fillIn('[data-test-textarea="dcpProjectdescriptionproposedactions"]', exceedMaximum(2000, 'String'));
    assert.dom('[data-test-validation-message="dcpProjectdescriptionproposedactions"]').hasText('Text is too long (max 2000 characters)');
    await fillIn('[data-test-textarea="dcpProjectdescriptionproposedactions"]', 'abc');
    assert.dom('[data-test-validation-message="dcpProjectdescriptionproposedactions"]').doesNotExist();

    // dcpProjectdescriptionproposedarea (length limits)
    assert.dom('[data-test-validation-message="dcpProjectdescriptionproposedarea"]').doesNotExist();
    await fillIn('[data-test-textarea="dcpProjectdescriptionproposedarea"]', exceedMaximum(3000, 'String'));
    assert.dom('[data-test-validation-message="dcpProjectdescriptionproposedarea"]').hasText('Text is too long (max 3000 characters)');
    await fillIn('[data-test-textarea="dcpProjectdescriptionproposedarea"]', 'abc');
    assert.dom('[data-test-validation-message="dcpProjectdescriptionproposedarea"]').doesNotExist();

    // dcpProjectdescriptionsurroundingarea (length limits)
    assert.dom('[data-test-validation-message="dcpProjectdescriptionsurroundingarea"]').doesNotExist();
    await fillIn('[data-test-textarea="dcpProjectdescriptionsurroundingarea"]', exceedMaximum(3000, 'String'));
    assert.dom('[data-test-validation-message="dcpProjectdescriptionsurroundingarea"]').hasText('Text is too long (max 3000 characters)');
    await fillIn('[data-test-textarea="dcpProjectdescriptionsurroundingarea"]', 'abc');
    assert.dom('[data-test-validation-message="dcpProjectdescriptionsurroundingarea"]').doesNotExist();

    // dcpProjectattachmentsotherinformation (length limits)
    assert.dom('[data-test-validation-message="dcpProjectattachmentsotherinformation"]').doesNotExist();
    await fillIn('[data-test-textarea="dcpProjectattachmentsotherinformation"]', exceedMaximum(2000, 'String'));
    assert.dom('[data-test-validation-message="dcpProjectattachmentsotherinformation"]').hasText('Text is too long (max 2000 characters)');
    await fillIn('[data-test-textarea="dcpProjectattachmentsotherinformation"]', 'abc');
    assert.dom('[data-test-validation-message="dcpProjectattachmentsotherinformation"]').doesNotExist();
  });
});
