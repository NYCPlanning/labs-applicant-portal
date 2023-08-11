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
      packages: [this.server.create('package', 'toDo', 'rwcdsForm')],
    });

    await visit('/rwcds-form/1/edit');

    assert.equal(currentURL(), '/rwcds-form/1/edit');

    assert.dom('[data-test-input="dcpProjectsitedescription"]').hasNoValue();
    await fillIn('[data-test-input="dcpProjectsitedescription"]', 'Whatever affects one directly, affects all indirectly.');
    await fillIn('[data-test-input="dcpNumberofnewdwellingunits"]', '5000');
    await fillIn('[data-test-input="dcpIncrementhousingunits"]', '5000');
    await fillIn('[data-test-input="dcpActionaffordabledwellingunits"]', '5000');
    await fillIn('[data-test-input="dcpIncrementalaffordabledwellingunits"]', '5000');
    await fillIn('[data-test-input="dcpResidentialsqft"]', '5000');
    await fillIn('[data-test-input="dcpNewcommercialsqft"]', '5000');
    await fillIn('[data-test-input="dcpNewindustrialsqft"]', '5000');
    await fillIn('[data-test-input="dcpNewcommunityfacilitysqft"]', '5000');

    await click('[data-test-save-button]');

    await settled();

    assert.dom('[data-test-input="dcpProjectsitedescription"]').hasValue('Whatever affects one directly, affects all indirectly.');

    assert.equal(this.server.db.rwcdsForms.firstObject.dcpProjectsitedescription, 'Whatever affects one directly, affects all indirectly.');
  });

  test('User can save proposed actions information on rwcds form', async function(assert) {
    this.server.create('project', 1, {
      packages: [this.server.create('package', 'toDo', 'rwcdsForm')],
    });

    await visit('/rwcds-form/1/edit');

    assert.equal(currentURL(), '/rwcds-form/1/edit');

    assert.dom('[data-test-input="dcpModifiedzrsectionnumber"]').hasNoValue();
    await fillIn('[data-test-input="dcpModifiedzrsectionnumber"]', 'blah blah blah');
    await fillIn('[data-test-input="dcpNumberofnewdwellingunits"]', '5000');
    await fillIn('[data-test-input="dcpIncrementhousingunits"]', '5000');
    await fillIn('[data-test-input="dcpActionaffordabledwellingunits"]', '5000');
    await fillIn('[data-test-input="dcpIncrementalaffordabledwellingunits"]', '5000');
    await fillIn('[data-test-input="dcpResidentialsqft"]', '5000');
    await fillIn('[data-test-input="dcpNewcommercialsqft"]', '5000');
    await fillIn('[data-test-input="dcpNewindustrialsqft"]', '5000');
    await fillIn('[data-test-input="dcpNewcommunityfacilitysqft"]', '5000');

    await click('[data-test-save-button]');

    await settled();

    assert.dom('[data-test-input="dcpModifiedzrsectionnumber"]').hasValue('blah blah blah');

    assert.equal(this.server.db.affectedZoningResolutions.firstObject.dcpModifiedzrsectionnumber, 'blah blah blah');
  });

  test('User can visit, edit, save, and submit rwcds-form route', async function(assert) {
    this.server.create('project', 1, {
      packages: [this.server.create('package', 'toDo', 'rwcdsForm')],
    });

    await visit('/rwcds-form/1/edit');

    assert.equal(currentURL(), '/rwcds-form/1/edit');

    assert.dom('[data-test-input="dcpProjectsitedescription"]').hasNoValue();
    await fillIn('[data-test-input="dcpProjectsitedescription"]', 'Whatever affects one directly, affects all indirectly.');
    await fillIn('[data-test-input="dcpProposedprojectdevelopmentdescription"]', 'bananas');

    await click('[data-test-save-button]');

    await settled();

    await click('[data-test-submit-button]');
    await click('[data-test-confirm-submit-button]');

    assert.equal(currentURL(), '/rwcds-form/1?header=true');
  });

  test('User can view existing values in Project Description section', async function(assert) {
    this.server.create('project', 1, {
      packages: [this.server.create('package', 'toDo', {
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

    assert.dom('[data-test-input="dcpProjectsitedescription"]').hasValue('Mixed use');
    assert.dom('[data-test-input="dcpProposedprojectdevelopmentdescription"]').hasValue('Increase equity');
    assert.dom('[data-test-input="dcpBuildyear"]').hasValue('1990');
    assert.dom('[data-test-input="dcpSitehistory"]').hasValue('Some history');
  });

  test('Validation messages display for Project Description', async function(assert) {
    this.server.create('project', 1, {
      packages: [this.server.create('package', 'toDo', 'rwcdsForm')],
    });

    await visit('/rwcds-form/1/edit');

    assert.equal(currentURL(), '/rwcds-form/1/edit');

    await fillIn('[data-test-input="dcpProjectsitedescription"]', exceedMaximum(2400, 'String'));
    assert.dom('[data-test-validation-message="dcpProjectsitedescription"').hasText('Text is too long (max 2400 characters)');

    await fillIn('[data-test-input="dcpProposedprojectdevelopmentdescription"]', exceedMaximum(2400, 'String'));
    assert.dom('[data-test-validation-message="dcpProposedprojectdevelopmentdescription"').hasText('Text is too long (max 2400 characters)');

    await fillIn('[data-test-input="dcpBuildyear"]', exceedMaximum(4, 'Number'));
    assert.dom('[data-test-validation-message="dcpBuildyear"').hasText('Number is too long (max 4 characters)');

    await fillIn('[data-test-input="dcpRationalbehindthebuildyear"]', exceedMaximum(2400, 'String'));
    assert.dom('[data-test-validation-message="dcpRationalbehindthebuildyear"').hasText('Text is too long (max 2400 characters)');

    await fillIn('[data-test-input="dcpSitehistory"]', exceedMaximum(2400, 'String'));
    assert.dom('[data-test-validation-message="dcpSitehistory"').hasText('Text is too long (max 2400 characters)');
  });

  test('Validation messages display for Proposed Actions', async function(assert) {
    this.server.create('project', 1, {
      packages: [this.server.create('package', 'toDo', 'rwcdsForm')],
    });

    await visit('/rwcds-form/1/edit');

    assert.equal(currentURL(), '/rwcds-form/1/edit');

    assert.dom('[data-test-zrsectionnumber]').exists();

    await fillIn('[data-test-input="dcpModifiedzrsectionnumber"]', exceedMaximum(25, 'String'));
    assert.dom('[data-test-validation-message="dcpModifiedzrsectionnumber"]').hasText('Text is too long (max 25 characters)');

    await fillIn('[data-test-input="dcpZrsectiontitle"]', exceedMaximum(100, 'String'));
    assert.dom('[data-test-validation-message="dcpZrsectiontitle"]').hasText('Text is too long (max 100 characters)');

    await fillIn('[data-test-input="dcpPurposeandneedfortheproposedaction"]', exceedMaximum(2400, 'String'));
    assert.dom('[data-test-validation-message="dcpPurposeandneedfortheproposedaction"]').hasText('Text is too long (max 2400 characters)');

    assert.dom('[data-test-validation-message="dcpWhichactionsfromotheragenciesaresought"]').doesNotExist();
    await click('[data-test-radio="dcpIsapplicantseekingaction"][data-test-radio-option="Yes"]');

    await fillIn('[data-test-input="dcpWhichactionsfromotheragenciesaresought"]', exceedMaximum(2400, 'String'));
    assert.dom('[data-test-validation-message="dcpWhichactionsfromotheragenciesaresought"]').hasText('Text is too long (max 2400 characters)');

    await fillIn('[data-test-input="dcpWhichactionsfromotheragenciesaresought"]', '');
    assert.dom('[data-test-validation-message="dcpWhichactionsfromotheragenciesaresought"]').hasText('This field is required');
  });

  test('Validation messages display for With-Action-No-Action', async function(assert) {
    this.server.create('project', 1, {
      packages: [this.server.create('package', 'toDo', 'rwcdsForm')],
    });

    await visit('/rwcds-form/1/edit');

    assert.equal(currentURL(), '/rwcds-form/1/edit');

    // no-action
    await fillIn('[data-test-input="dcpDevelopmentsiteassumptions"]', exceedMaximum(4800, 'String'));
    assert.dom('[data-test-validation-message="dcpDevelopmentsiteassumptions"').hasText('Text is too long (max 4800 characters)');

    await fillIn('[data-test-input="dcpDescribethenoactionscenario"]', exceedMaximum(2400, 'String'));
    assert.dom('[data-test-validation-message="dcpDescribethenoactionscenario"').hasText('Text is too long (max 2400 characters)');

    await click('[data-test-radio="dcpExistingconditions"][data-test-radio-option="No"]');

    await fillIn('[data-test-input="dcpHowdidyoudeterminethenoactionscenario"]', exceedMaximum(2400, 'String'));
    assert.dom('[data-test-validation-message="dcpHowdidyoudeterminethenoactionscenario"').hasText('Text is too long (max 2400 characters)');

    // with-action
    await fillIn('[data-test-input="dcpDescribethewithactionscenario"]', exceedMaximum(2400, 'String'));
    assert.dom('[data-test-validation-message="dcpDescribethewithactionscenario"').hasText('Text is too long (max 2400 characters)');

    await fillIn('[data-test-input="dcpHowdidyoudeterminethiswithactionscena"]', exceedMaximum(2400, 'String'));
    assert.dom('[data-test-validation-message="dcpHowdidyoudeterminethiswithactionscena"').hasText('Text is too long (max 2400 characters)');

    await click('[data-test-radio="dcpIsrwcdsscenario"][data-test-radio-option="Yes"]');

    assert.dom('[data-test-validation-message="dcpRwcdsexplanation"]').hasText('This field is required');

    await fillIn('[data-test-input="dcpRwcdsexplanation"]', exceedMaximum(2400, 'String'));
    assert.dom('[data-test-validation-message="dcpRwcdsexplanation"').hasText('Text is too long (max 2400 characters)');
  });

  test('Validation messages display for Project Area Units and Square Footage form questions', async function(assert) {
    this.server.create('project', 1, {
      packages: [this.server.create('package', 'toDo', 'rwcdsForm')],
    });

    await visit('/rwcds-form/1/edit');

    assert.equal(currentURL(), '/rwcds-form/1/edit');

    await fillIn('[data-test-input="dcpNumberofnewdwellingunits"]', '50000000000');
    assert.dom('[data-test-validation-message="dcpNumberofnewdwellingunits"').hasText('Text is too long (max 10 characters)');

    await fillIn('[data-test-input="dcpNumberofnewdwellingunits"]', 'Jiro');
    assert.dom('[data-test-validation-message="dcpNumberofnewdwellingunits"').hasText('Must be a number');

    await fillIn('[data-test-input="dcpNumberofnewdwellingunits"]', 'JiroisaGoodBoy');
    assert.dom('[data-test-validation-message="dcpNumberofnewdwellingunits"').hasText('Text is too long (max 10 characters), Must be a number');

    await fillIn('[data-test-input="dcpIncrementhousingunits"]', '50000000000');
    assert.dom('[data-test-validation-message="dcpIncrementhousingunits"').hasText('Text is too long (max 10 characters)');

    await fillIn('[data-test-input="dcpIncrementhousingunits"]', 'Jiro');
    assert.dom('[data-test-validation-message="dcpIncrementhousingunits"').hasText('Must be a number');

    await fillIn('[data-test-input="dcpActionaffordabledwellingunits"]', '50000000000');
    assert.dom('[data-test-validation-message="dcpActionaffordabledwellingunits"').hasText('Text is too long (max 10 characters)');

    await fillIn('[data-test-input="dcpActionaffordabledwellingunits"]', 'Jiro');
    assert.dom('[data-test-validation-message="dcpActionaffordabledwellingunits"').hasText('Must be a number');

    await fillIn('[data-test-input="dcpIncrementalaffordabledwellingunits"]', '50000000000');
    assert.dom('[data-test-validation-message="dcpIncrementalaffordabledwellingunits"').hasText('Text is too long (max 10 characters)');

    await fillIn('[data-test-input="dcpIncrementalaffordabledwellingunits"]', 'Jiro');
    assert.dom('[data-test-validation-message="dcpIncrementalaffordabledwellingunits"').hasText('Must be a number');

    await fillIn('[data-test-input="dcpResidentialsqft"]', '50000000000');
    assert.dom('[data-test-validation-message="dcpResidentialsqft"').hasText('Text is too long (max 10 characters)');

    await fillIn('[data-test-input="dcpResidentialsqft"]', 'Jiro');
    assert.dom('[data-test-validation-message="dcpResidentialsqft"').hasText('Must be a number');

    await fillIn('[data-test-input="dcpNewcommercialsqft"]', '50000000000');
    assert.dom('[data-test-validation-message="dcpNewcommercialsqft"').hasText('Text is too long (max 10 characters)');

    await fillIn('[data-test-input="dcpNewcommercialsqft"]', 'Jiro');
    assert.dom('[data-test-validation-message="dcpNewcommercialsqft"').hasText('Must be a number');

    await fillIn('[data-test-input="dcpNewindustrialsqft"]', '50000000000');
    assert.dom('[data-test-validation-message="dcpNewindustrialsqft"').hasText('Text is too long (max 10 characters)');

    await fillIn('[data-test-input="dcpNewindustrialsqft"]', 'Jiro');
    assert.dom('[data-test-validation-message="dcpNewindustrialsqft"').hasText('Must be a number');

    await fillIn('[data-test-input="dcpNewcommunityfacilitysqft"]', '50000000000');
    assert.dom('[data-test-validation-message="dcpNewcommunityfacilitysqft"').hasText('Text is too long (max 10 characters)');

    await fillIn('[data-test-input="dcpNewcommunityfacilitysqft"]', 'Jiro');
    assert.dom('[data-test-validation-message="dcpNewcommunityfacilitysqft"').hasText('Must be a number');
  });
});
