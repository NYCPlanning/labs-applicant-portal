import { module, test } from 'qunit';
import {
  visit,
  click,
  currentURL,
  settled,
  waitFor,
  fillIn,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { authenticateSession } from 'ember-simple-auth/test-support';
import { selectFiles } from 'ember-file-upload/test-support';

module('Acceptance | user can click package edit', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(() => {
    authenticateSession({
      emailaddress1: 'me@me.com',
    });
  });

  test('User can visit edit package route', async function(assert) {
    this.server.create('project', 1, 'applicant');

    await visit('/projects');
    await click('[data-test-project="edit-pas"]');

    assert.equal(currentURL(), '/packages/1/edit');
  });

  test('User can visit save and submit package', async function (assert) {
    this.server.create('project', 1, 'applicant');

    await visit('/projects');
    await click('[data-test-project="edit-pas"]');
    await click('[data-test-save-button]');

    await waitFor('[data-test-submit-button]:not([disabled])');
    await click('[data-test-submit-button]');
    await click('[data-test-confirm-submit-button]');

    // for some reason promises aren't being captured so we await for settled state
    await settled();

    // use waitFor as a way to "wait" for the transition
    // within the pas-form/edit Component submit() task
    await waitFor('[data-test-show-dcprevisedprojectname]');

    assert.equal(currentURL(), '/packages/1');
  });

  test('Save button is enabled when file marked for deletion', async function (assert) {
    // TODO: Refactor factories so there doesn't need to be duplicate package
    const project = this.server.create('project', 'applicant');
    this.server.create('package', 'applicant', 'withExistingDocuments', {
      project,
    });

    await visit('/packages/2/edit');

    // ! We remove the pregenerated applicant here to disable the "save" button.
    // Clicking "Save" to disable the Save button causes a race condition:
    // The automated clicks act so fast that the file is marked for deletion
    // BEFORE the full Save operation completes,
    // causing the file marked for deletion to be immediately cleared.
    // TODO: Perhaps rework frontend using a Task group to prevent
    // this race condition.
    await click('[data-test-remove-applicant-button]');

    assert.dom('[data-test-save-button]').isDisabled();

    await click('[data-test-delete-file-button="0"]');

    assert.dom('[data-test-save-button]').isEnabled();
  });

  test('Save button is enabled when file marked for upload', async function (assert) {
    const project = this.server.create('project', 'applicant');
    this.server.create('package', 'applicant', 'withExistingDocuments', {
      project,
    });

    await visit('/packages/2/edit');

    // See note in previous test about why this click to remove applicant
    // is performed.
    await click('[data-test-remove-applicant-button]');

    assert.dom('[data-test-save-button]').isDisabled();

    const file = new File(['foo'], 'Zoning Application.pdf', { type: 'text/plain' });

    await selectFiles('#FileUploader2 > input', file);

    assert.dom('[data-test-save-button]').isEnabled();
  });

  test('Files marked for upload and deletion are cleared on Save', async function (assert) {
    const project = this.server.create('project', 'applicant');
    this.server.create('package', 'applicant', 'withExistingDocuments', {
      project,
    });

    await visit('/packages/2/edit');

    const file = new File(['foo'], 'Zoning Application.pdf', { type: 'text/plain' });
    await selectFiles('#FileUploader2 > input', file);

    await click('[data-test-delete-file-button="0"]');

    await assert.dom('[data-test-document-to-be-deleted-name]').exists();
    await assert.dom('[data-test-document-to-be-uploaded-name]').exists();

    await click('[data-test-save-button]');

    await assert.dom('[data-test-document-to-be-deleted-name]').doesNotExist();
    await assert.dom('[data-test-document-to-be-uploaded-name]').doesNotExist();
  });

  test('Urban Renewal Area sub Q shows conditionally', async function (assert) {
    this.server.create('project', 1, 'applicant');

    await visit('/packages/1/edit');
    assert.dom('[data-test-dcpurbanrenewalareaname]').doesNotExist();

    await click('[data-test-dcpurbanrenewalarea="Yes"]');
    assert.dom('[data-test-dcpurbanrenewalareaname]').exists();
  });

  test('SEQRA or CEQR sub Q shows conditionally', async function (assert) {
    this.server.create('project', 1, 'applicant');

    await visit('/packages/1/edit');

    assert.dom('[data-test-dcppleaseexplaintypeiienvreview]').doesNotExist();
    await click('[data-test-dcplanduseactiontype2="Yes"]');
    assert.dom('[data-test-dcppleaseexplaintypeiienvreview]').exists();
  });

  test('Industrial Business Zone sub Q shows conditionally', async function (assert) {
    this.server.create('project', 1, 'applicant');

    await visit('/packages/1/edit');

    assert.dom('[data-test-dcpprojectareaindustrialbusinesszonename]').doesNotExist();
    await click('[data-test-dcpprojectareaindustrialbusinesszone="Yes"]');
    assert.dom('[data-test-dcpprojectareaindustrialbusinesszonename]').exists();
  });

  test('Landmark or Historic District sub Q shows conditionally', async function (assert) {
    this.server.create('project', 1, 'applicant');

    await visit('/packages/1/edit');

    assert.dom('[data-test-dcpisprojectarealandmarkname]').doesNotExist();
    await click('[data-test-dcpIsprojectarealandmark="Yes"]');
    assert.dom('[data-test-dcpisprojectarealandmarkname]').exists();
  });

  test('Other Type sub Q shows conditionally', async function (assert) {
    this.server.create('project', 1, 'applicant');

    await visit('/packages/1/edit');

    assert.dom('[data-test-dcpproposeddevelopmentsiteotherexplanation]').doesNotExist();
    await click('[data-test-dcpproposeddevelopmentsiteinfoother]');
    assert.dom('[data-test-dcpproposeddevelopmentsiteotherexplanation]').exists();
  });

  test('MIH sub Q shows conditionally', async function (assert) {
    this.server.create('project', 1, 'applicant');

    await visit('/packages/1/edit');

    assert.dom('[data-test-dcpinclusionaryhousingdesignatedareaname]').doesNotExist();
    await click('[data-test-dcpisinclusionaryhousingdesignatedarea="Yes"]');
    assert.dom('[data-test-dcpinclusionaryhousingdesignatedareaname]').exists();
  });

  test('Funding Source sub Q shows conditionally', async function (assert) {
    this.server.create('project', 1, 'applicant');

    await visit('/packages/1/edit');

    assert.dom('[data-test-dcphousingunittype="City"]').doesNotExist();
    assert.dom('[data-test-dcphousingunittype="State"]').doesNotExist();
    assert.dom('[data-test-dcphousingunittype="Federal"]').doesNotExist();
    assert.dom('[data-test-dcphousingunittype="Other"]').doesNotExist();

    await click('[data-test-dcpdiscressionaryfundingforffordablehousing="Yes"]');
    assert.dom('[data-test-dcphousingunittype="City"]').exists();
    assert.dom('[data-test-dcphousingunittype="State"]').exists();
    assert.dom('[data-test-dcphousingunittype="Federal"]').exists();
    assert.dom('[data-test-dcphousingunittype="Other"]').exists();
  });

  test('user can save pas form', async function (assert) {
    this.server.create('project', 1, 'applicant');

    await visit('/packages/1/edit');

    // save button should start disabled
    // TODO: fix this test.  The form starts dirty because we implicitly create a new applicant when the applicants array is empty
    // assert.dom('[data-test-save-button').hasProperty('disabled', true);

    // edit a field to make it pasForm dirty
    await fillIn('[data-test-dcprevisedprojectname]', 'Some Cool New Project Name');

    // save button should become active when dirty
    assert.dom('[data-test-save-button').hasProperty('disabled', false);

    // save it
    await click('[data-test-save-button]');
    await settled(); // async make sure save action finishes before assertion

    // database record should have new updated value
    assert.equal(this.server.db.pasForms[0].dcpRevisedprojectname, 'Some Cool New Project Name');
  });

  test('user sees a confirmation modal upon submit', async function (assert) {
    this.server.create('project', 1, 'applicant');

    // render form
    await visit('/packages/1/edit');

    // modal doesn't exist to start
    assert.dom('[data-test-reveal-modal]').doesNotExist();
    assert.dom('[data-test-confirm-submit-button]').doesNotExist();

    // click submit
    await click('[data-test-submit-button]');

    // modal should exist
    assert.dom('[data-test-reveal-modal]').exists();
    assert.dom('[data-test-confirm-submit-button]').exists();

    await click('[data-test-confirm-submit-button]');

    // research: ember changeset validations save method triggers a
    // promise that resolves _after_ mirage has been torn down by tests
    await settled();

    assert.ok(true);
  });

  test('Urban Renewal Area sub Q, after set to no, does not block submit', async function (assert) {
    this.server.create('package', 1, {
      pasForm: this.server.create('pas-form', {
        dcpUrbanrenewalarea: null,
        dcpUrbanareaname: '',
      }),
      project: this.server.create('project'),
    });

    await visit('/packages/1/edit');

    assert.dom('[data-test-save-button]').hasNoAttribute('disabled');
    assert.dom('[data-test-submit-button]').hasNoAttribute('disabled');

    await click('[data-test-dcpurbanrenewalarea="Yes"]');

    assert.dom('[data-test-dcpurbanrenewalareaname-validation]').exists();
    assert.dom('[data-test-save-button]').hasNoAttribute('disabled');
    assert.dom('[data-test-submit-button]').hasAttribute('disabled');

    await fillIn('[data-test-dcpurbanrenewalareaname]', 'abc');

    assert.dom('[data-test-dcpurbanrenewalareaname-validation]').doesNotExist();
    assert.dom('[data-test-save-button]').hasNoAttribute('disabled');
    assert.dom('[data-test-submit-button]').hasNoAttribute('disabled');

    await fillIn('[data-test-dcpurbanrenewalareaname]', '');

    assert.dom('[data-test-dcpurbanrenewalareaname-validation]').exists('it revalidates');
    assert.dom('[data-test-save-button]').hasNoAttribute('disabled');
    assert.dom('[data-test-submit-button]').hasAttribute('disabled');
  });
});
