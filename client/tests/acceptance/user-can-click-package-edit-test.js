import { module, test } from 'qunit';
import {
  visit,
  click,
  currentURL,
  settled,
  waitFor,
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
});
