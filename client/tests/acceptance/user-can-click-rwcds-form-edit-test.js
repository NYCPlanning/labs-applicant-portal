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

    await fillIn('[data-test-textarea="dcpSitehistory"]', exceedMaximum(600, 'String'));
    assert.dom('[data-test-validation-message="dcpSitehistory"').hasText('Text is too long (max 600 characters)');
  });
});
