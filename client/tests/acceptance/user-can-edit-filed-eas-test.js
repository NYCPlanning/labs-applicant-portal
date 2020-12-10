import { module, test } from 'qunit';
import {
  visit,
  click,
  findAll,
  currentURL,
  settled,
  waitFor,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { authenticateSession } from 'ember-simple-auth/test-support';
import { selectFiles } from 'ember-file-upload/test-support';
import { selectChoose } from 'ember-power-select/test-support';

const saveForm = async () => {
  await click('[data-test-save-button]');
  await settled();
};

module('Acceptance | user can edit Filed EAS Packages', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(() => {
    authenticateSession({
      emailaddress1: 'me@me.com',
    });
  });

  test('User sees Project under Awaiting Submission if it has an active Filed EAS', async function (assert) {
    this.server.create('project', {
      packages: [
        this.server.create('package', 'toDo', 'filedEas'),
        this.server.create('package', 'done', 'filedEas'),
      ],
    });

    this.server.create('project', {
      packages: [
        this.server.create('package', 'done', 'filedEas'),
      ],
    });

    await visit('/projects');
    assert.equal(findAll('[data-test-projects-list="to-do"] [data-test-my-project-list-item]').length, 1);

    assert.equal(findAll('[data-test-projects-list="done"] [data-test-my-project-list-item]').length, 1);
  });

  test('User sees Filed EAS Packages section on Project page when one exists', async function (assert) {
    this.server.create('project', {
      packages: [
        this.server.create('package', 'toDo', 'filedEas'),
        this.server.create('package', 'toDo', 'filedEas'),
      ],
    });

    await visit('/projects/1');

    assert.dom('[data-test-package-section="Environmental Assessment Statement (EAS)"]').exists();

    assert.equal(findAll('[data-test-package-link]').length, 2);
  });

  test('User can click into Filed EAS and see Package info, Package notes, and Attachments', async function (assert) {
    this.server.create('project', {
      packages: [
        this.server.create('package', 'toDo', 'filedEas'),
      ],
    });

    await visit('/projects/1');

    await click('[data-test-package-link="1"]');

    assert.equal(currentURL(), '/filed-eas/1/edit');

    assert.dom('[data-test-package-dcpPackageversion]').hasText('(V1)');

    assert.dom('[data-test-project-dcpProjectname]').containsText('Huge New Public Library');

    assert.dom('[data-test-project-dcpName]').hasText('(P2018M0268)');

    assert.dom('[data-test-project-dcpBorough]').containsText('Bronx');

    assert.dom('[data-test-package-statuscode]').containsText('Package Preparation');

    assert.dom('[data-test-package-notes]').containsText('Some instructions from Planners');

    assert.dom('[data-test-attached-documents]').exists();
  });

  test('User can submit Filed EAS and see Package info and Attached Documents section', async function (assert) {
    this.server.create('project', {
      packages: [
        this.server.create('package', 'toDo', 'filedEas'),
      ],
    });

    await visit('/filed-eas/1/edit');

    // filling out necessary fields for submit, also tests ceqr-invoice-questionnaire
    await click('[data-test-radio="dcpIsthesoleaapplicantagovtagency"][data-test-radio-option="Yes"]');

    const file = new File(['foo'], 'Zoning Application.pdf', { type: 'text/plain' });

    await selectFiles('#FileUploader1 > input', file);

    await assert.dom('[data-test-document-to-be-uploaded-name]').exists();

    saveForm();

    await waitFor('[data-test-document-name="0"');

    await assert.dom('[data-test-document-to-be-uploaded-name]').doesNotExist();

    await click('[data-test-submit-button]');

    await click('[data-test-confirm-submit-button]');

    await settled();

    await waitFor('[data-test-project-dcpProjectname]');

    assert.equal(currentURL(), '/filed-eas/1?header=true');

    assert.dom('[data-test-attached-documents]').exists();
  });

  test('User sees CEQR on the Filed EAS Show page', async function (assert) {
    this.server.create('project', {
      packages: [
        this.server.create('package', 'toDo', 'scopeOfWorkDraft'),
      ],
    });

    await visit('/scope-of-work-draft/1');

    assert.dom('[data-test-ceqr-invoice-questionnaire]').exists();
  });

  test('User sees Attached Documents on the Filed EAS Show page', async function (assert) {
    this.server.create('project', {
      packages: [
        this.server.create('package', 'toDo', 'withExistingDocuments', 'filedEas'),
      ],
    });

    await visit('/filed-eas/1');

    assert.dom('[data-test-document-name="0"]').containsText('PAS Form.pdf');
    assert.dom('[data-test-document-name="1"]').containsText('Action Changes.excel');
  });

  test('User can click through Ceqr Invoice Questionnaire section on Filed Eas', async function (assert) {
    this.server.create('project', {
      packages: [
        this.server.create('package', 'toDo', 'filedEas'),
      ],
    });

    await visit('/filed-eas/1/edit');

    await click('[data-test-radio="dcpIsthesoleaapplicantagovtagency"][data-test-radio-option="No"]');
    await click('[data-test-radio="dcpProjectspolelyconsistactionsnotmeasurable"][data-test-radio-option="No"]');
    await selectChoose('[data-test-dcpsquarefeet-picker]', 'less than 10,000 square feet');
    await click('[data-test-radio="dcpProjectmodificationtoapreviousapproval"][data-test-radio-option="No"]');
    await click('[data-test-radio="dcpRespectivedecrequired"][data-test-radio-option="Yes"]');

    await click('[data-test-save-button]');

    assert.equal(currentURL(), '/filed-eas/1/edit');
  });
});
