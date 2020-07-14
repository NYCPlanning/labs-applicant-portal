import { module, test } from 'qunit';
import {
  click,
  fillIn,
  settled,
  visit,
  currentURL,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { authenticateSession } from 'ember-simple-auth/test-support';
import exceedMaximum from '../helpers/exceed-maximum-characters';

module('Acceptance | user can click rwcds edit', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(() => {
    authenticateSession({
      emailaddress1: 'me@me.com',
    });
  });

  test('User can visit, edit and save rwcds-form route', async function(assert) {
    this.server.create('project', 1, {
      packages: [this.server.create('package', 'applicant', 'rwcdsForm')],
    });

    await visit('/rwcds-form/1/edit');

    assert.equal(currentURL(), '/rwcds-form/1/edit');

    assert.dom('[data-test-textarea="dcpProjectsitedescription"]').hasNoValue();
    await fillIn('[data-test-textarea="dcpProjectsitedescription"]', 'Whatever affects one directly, affects all indirectly.');

    await click('[data-test-save-button]');

    await settled();

    assert.dom('[data-test-textarea="dcpProjectsitedescription"]').hasValue('Whatever affects one directly, affects all indirectly.');

    assert.equal(this.server.db.rwcdsForms.firstObject.dcpProjectsitedescription, 'Whatever affects one directly, affects all indirectly.');
  });

  test('User can visit, edit, save, and submit rwcds-form route', async function(assert) {
    this.server.create('project', 1, {
      packages: [this.server.create('package', 'applicant', 'rwcdsForm')],
    });

    await visit('/rwcds-form/1/edit');

    assert.equal(currentURL(), '/rwcds-form/1/edit');

    assert.dom('[data-test-textarea="dcpProjectsitedescription"]').hasNoValue();
    await fillIn('[data-test-textarea="dcpProjectsitedescription"]', 'Whatever affects one directly, affects all indirectly.');

    await fillIn('[data-test-textarea="dcpProposedprojectdevelopmentdescription"]', 'bananas');

    await click('[data-test-save-button]');

    await settled();

    await click('[data-test-submit-button]');
    await click('[data-test-confirm-submit-button]');

    assert.equal(currentURL(), '/rwcds-form/1');
  });

  test('User can view existing values in Project Description section', async function(assert) {
    this.server.create('project', 1, {
      packages: [this.server.create('package', 'applicant', {
        dcpPackagetype: 717170004,
        rwcdsForm: this.server.create('rwcds-form', {
          dcpProjectsitedescription: 'Mixed use',
          dcpProposedprojectdevelopmentdescription: 'Increase equity',
          dcpBuildyear: '1990',
          dcpSitehistory: 'Some history',
        }),
      })],
    });

    await visit('/rwcds-form/1/edit');

    assert.equal(currentURL(), '/rwcds-form/1/edit');

    assert.dom('[data-test-textarea="dcpProjectsitedescription"]').hasValue('Mixed use');
    assert.dom('[data-test-textarea="dcpProposedprojectdevelopmentdescription"]').hasValue('Increase equity');
    assert.dom('[data-test-input="dcpBuildyear"]').hasValue('1990');
    assert.dom('[data-test-textarea="dcpSitehistory"]').hasValue('Some history');
  });

  test('Validation messages display for Project Description', async function(assert) {
    this.server.create('project', 1, {
      packages: [this.server.create('package', 'applicant', 'rwcdsForm')],
    });

    await visit('/rwcds-form/1/edit');

    assert.equal(currentURL(), '/rwcds-form/1/edit');

    await fillIn('[data-test-textarea="dcpProjectsitedescription"]', exceedMaximum(2400, 'String'));
    assert.dom('[data-test-validation-message="dcpProjectsitedescription"').hasText('Text is too long (max 2400 characters)');

    await fillIn('[data-test-textarea="dcpProposedprojectdevelopmentdescription"]', exceedMaximum(1800, 'String'));
    assert.dom('[data-test-validation-message="dcpProposedprojectdevelopmentdescription"').hasText('Text is too long (max 1800 characters)');

    await fillIn('[data-test-input="dcpBuildyear"]', exceedMaximum(4, 'Number'));
    assert.dom('[data-test-validation-message="dcpBuildyear"').hasText('Number is too long (max 4 characters)');

    await fillIn('[data-test-input="dcpRationalbehindthebuildyear"]', exceedMaximum(300, 'String'));
    assert.dom('[data-test-validation-message="dcpRationalbehindthebuildyear"').hasText('Text is too long (max 300 characters)');

    await fillIn('[data-test-textarea="dcpSitehistory"]', exceedMaximum(600, 'String'));
    assert.dom('[data-test-validation-message="dcpSitehistory"').hasText('Text is too long (max 600 characters)');
  });

  test('Validation messages display for Proposed Actions', async function(assert) {
    this.server.create('project', 1, {
      packages: [this.server.create('package', 'applicant', 'rwcdsForm')],
    });

    await visit('/rwcds-form/1/edit');

    assert.equal(currentURL(), '/rwcds-form/1/edit');

    assert.dom('[data-test-zrsectionnumber]').exists();

    await fillIn('[data-test-input="dcpModifiedzrsectionnumber"]', exceedMaximum(25, 'String'));
    assert.dom('[data-test-validation-message="dcpModifiedzrsectionnumber"]').hasText('Text is too long (max 25 characters)');

    await fillIn('[data-test-input="dcpZrsectiontitle"]', exceedMaximum(100, 'String'));
    assert.dom('[data-test-validation-message="dcpZrsectiontitle"]').hasText('Text is too long (max 100 characters)');

    await fillIn('[data-test-input="dcpPurposeandneedfortheproposedaction"]', exceedMaximum(1500, 'String'));
    assert.dom('[data-test-validation-message="dcpPurposeandneedfortheproposedaction"]').hasText('Text is too long (max 1500 characters)');

    assert.dom('[data-test-validation-message="dcpWhichactionsfromotheragenciesaresought"]').doesNotExist();
    await click('[data-test-radio="dcpIsapplicantseekingaction"][data-test-radio-option="Yes"]');

    await fillIn('[data-test-input="dcpWhichactionsfromotheragenciesaresought"]', exceedMaximum(2400, 'String'));
    assert.dom('[data-test-validation-message="dcpWhichactionsfromotheragenciesaresought"]').hasText('Text is too long (max 2400 characters)');

    await fillIn('[data-test-input="dcpWhichactionsfromotheragenciesaresought"]', '');
    assert.dom('[data-test-validation-message="dcpWhichactionsfromotheragenciesaresought"]').hasText('This field is required');
  });

  test('Validation messages display for With-Action-No-Action', async function(assert) {
    this.server.create('project', 1, {
      packages: [this.server.create('package', 'applicant', 'rwcdsForm')],
    });

    await visit('/rwcds-form/1/edit');

    assert.equal(currentURL(), '/rwcds-form/1/edit');

    // no-action
    await fillIn('[data-test-textarea="dcpDevelopmentsiteassumptions"]', exceedMaximum(2400, 'String'));
    assert.dom('[data-test-validation-message="dcpDevelopmentsiteassumptions"').hasText('Text is too long (max 2400 characters)');

    await fillIn('[data-test-textarea="dcpDescribethenoactionscenario"]', exceedMaximum(1500, 'String'));
    assert.dom('[data-test-validation-message="dcpDescribethenoactionscenario"').hasText('Text is too long (max 1500 characters)');

    await click('[data-test-radio="dcpExistingconditions"][data-test-radio-option="No"]');

    await fillIn('[data-test-textarea="dcpHowdidyoudeterminethenoactionscenario"]', exceedMaximum(1500, 'String'));
    assert.dom('[data-test-validation-message="dcpHowdidyoudeterminethenoactionscenario"').hasText('Text is too long (max 1500 characters)');

    // with-action
    await fillIn('[data-test-textarea="dcpDescribethewithactionscenario"]', exceedMaximum(1500, 'String'));
    assert.dom('[data-test-validation-message="dcpDescribethewithactionscenario"').hasText('Text is too long (max 1500 characters)');

    await fillIn('[data-test-textarea="dcpHowdidyoudeterminethiswithactionscena"]', exceedMaximum(600, 'String'));
    assert.dom('[data-test-validation-message="dcpHowdidyoudeterminethiswithactionscena"').hasText('Text is too long (max 600 characters)');

    await click('[data-test-radio="dcpIsrwcdsscenario"][data-test-radio-option="Yes"]');

    assert.dom('[data-test-validation-message="dcpRwcdsexplanation"]').hasText('This field is required');

    await fillIn('[data-test-textarea="dcpRwcdsexplanation"]', exceedMaximum(50, 'String'));
    assert.dom('[data-test-validation-message="dcpRwcdsexplanation"').hasText('Text is too long (max 50 characters)');
  });
});
