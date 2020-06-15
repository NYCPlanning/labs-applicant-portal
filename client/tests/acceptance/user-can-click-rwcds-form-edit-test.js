import { module, test } from 'qunit';
import {
  fillIn,
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

  test('User can visit edit rwcds-form route', async function(assert) {
    this.server.create('project', 1, 'applicant');

    await visit('/rwcds-form/1/edit');

    assert.equal(currentURL(), '/rwcds-form/1/edit');
  });

  test('Validation messages display for Project Description', async function(assert) {
    this.server.create('project', 1, 'applicant');

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
