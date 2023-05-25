import { module, test } from 'qunit';
import {
  visit, click, findAll, currentURL, waitFor,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { authenticateSession } from 'ember-simple-auth/test-support';
import { selectFiles } from 'ember-file-upload/test-support';

const saveForm = async () => {
  await click('[data-test-save-button]');
};

module('Acceptance | user can edit DEIS Packages', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(() => {
    authenticateSession({
      emailaddress1: 'me@me.com',
    });
  });

  test('User sees Project under Awaiting Submission if it has an active Draft EIS', async function (assert) {
    this.server.create('project', {
      packages: [
        this.server.create('package', 'toDo', 'deis'),
        this.server.create('package', 'done', 'deis'),
      ],
    });

    this.server.create('project', {
      packages: [this.server.create('package', 'done', 'deis')],
    });

    await visit('/projects');
    assert.equal(
      findAll(
        '[data-test-projects-list="to-do"] [data-test-my-project-list-item]',
      ).length,
      1,
    );

    assert.equal(
      findAll(
        '[data-test-projects-list="done"] [data-test-my-project-list-item]',
      ).length,
      1,
    );
  });

  test('User sees Draft EIS Packages section on Project page when one exists', async function (assert) {
    this.server.create('project', {
      packages: [
        this.server.create('package', 'toDo', 'deis'),
        this.server.create('package', 'toDo', 'deis'),
      ],
    });

    await visit('/projects/1');

    assert
      .dom('[data-test-package-section="Environmental Impact Statement (EIS)"]')
      .exists();

    assert.equal(findAll('[data-test-package-link]').length, 2);
  });

  test('User can click into Draft EIS and see Package info, Package notes, and Attachments', async function (assert) {
    this.server.create('project', {
      packages: [this.server.create('package', 'toDo', 'deis')],
    });

    await visit('/projects/1');

    await click('[data-test-package-link="1"]');

    assert.equal(currentURL(), '/deis/1/edit');

    assert.dom('[data-test-package-dcpPackageversion]').hasText('(V1)');

    assert
      .dom('[data-test-project-dcpProjectname]')
      .containsText('Huge New Public Library');

    assert.dom('[data-test-project-dcpName]').hasText('(P2018M0268)');

    assert.dom('[data-test-project-dcpBorough]').containsText('Bronx');

    assert
      .dom('[data-test-package-statuscode]')
      .containsText('Package Preparation');

    assert
      .dom('[data-test-package-notes]')
      .containsText('Some instructions from Planners');

    assert.dom('[data-test-attached-documents]').exists();
  });

  test('User can submit Draft EIS and see Package info and Attached Documents section', async function (assert) {
    this.server.create('project', {
      packages: [this.server.create('package', 'toDo', 'deis')],
    });

    await visit('/deis/1/edit');

    const file = new File(['foo'], 'Zoning Application.pdf', {
      type: 'text/plain',
    });

    await selectFiles('#FileUploader1 > input', file);

    await assert.dom('[data-test-document-to-be-uploaded-name]').exists();

    saveForm();

    await waitFor('[data-test-document-name="0"]');

    await assert.dom('[data-test-document-to-be-uploaded-name]').doesNotExist();

    await click('[data-test-submit-button]');

    await click('[data-test-confirm-submit-button]');

    await waitFor('[data-test-project-dcpProjectname]');

    assert.equal(currentURL(), '/deis/1?header=true');

    assert.dom('[data-test-attached-documents]').exists();
  });

  test('User sees Attached Documents on the DEIS Show page', async function (assert) {
    this.server.create('project', {
      packages: [
        this.server.create('package', 'toDo', 'withExistingDocuments', 'deis'),
      ],
    });

    await visit('/deis/1');

    assert.dom('[data-test-document-name="0"]').containsText('PAS Form.pdf');
    assert
      .dom('[data-test-document-name="1"]')
      .containsText('Action Changes.excel');
  });
});
