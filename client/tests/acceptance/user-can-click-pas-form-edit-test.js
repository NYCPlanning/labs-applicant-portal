import { module, test } from 'qunit';
import {
  visit,
  click,
  currentURL,
  settled,
  waitFor,
  fillIn,
  triggerKeyEvent,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { authenticateSession } from 'ember-simple-auth/test-support';
import { selectFiles } from 'ember-file-upload/test-support';

module('Acceptance | user can click pas-form edit', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(() => {
    authenticateSession({
      emailaddress1: 'me@me.com',
    });
  });

  test('User can visit edit pas-form route', async function(assert) {
    this.server.create('project', 1, 'applicant');

    await visit('/projects');
    await click('[data-test-project="edit-pas"]');

    assert.equal(currentURL(), '/pas-form/1/edit');
  });

  test('User can visit save and submit pas-form package', async function (assert) {
    this.server.create('project', 1, 'applicant');

    await visit('/projects');
    await click('[data-test-project="edit-pas"]');
    await fillIn('[data-test-input="dcpRevisedprojectname"]', 'my project name');
    await click('[data-test-save-button]');

    await waitFor('[data-test-submit-button]:not([disabled])');
    await click('[data-test-submit-button]');
    await click('[data-test-confirm-submit-button]');

    // for some reason promises aren't being captured so we await for settled state
    await settled();

    // use waitFor as a way to "wait" for the transition
    // within the pas-form/edit Component submit() task
    await waitFor('[data-test-show="dcpRevisedprojectname"]');

    assert.equal(currentURL(), '/pas-form/1');
  });

  test('Save button is enabled when file marked for deletion', async function (assert) {
    // TODO: Refactor factories so there doesn't need to be duplicate package
    const project = this.server.create('project', 'applicant');
    this.server.create('package', 'applicant', 'withExistingDocuments', {
      project,
    });

    await visit('/pas-form/2/edit');

    assert.dom('[data-test-save-button]').isDisabled();

    await click('[data-test-delete-file-button="0"]');

    assert.dom('[data-test-save-button]').isEnabled();
  });

  test('Save button is enabled when file marked for upload', async function (assert) {
    const project = this.server.create('project', 'applicant');
    this.server.create('package', 'applicant', 'withExistingDocuments', {
      project,
    });

    await visit('/pas-form/2/edit');

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

    await visit('/pas-form/2/edit');

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

    await visit('/pas-form/1/edit');
    assert.dom('[data-test-input="dcpUrbanareaname"]').doesNotExist();

    await click('[data-test-radio="dcpUrbanrenewalarea"][data-test-radio-option="Yes"]');
    assert.dom('[data-test-input="dcpUrbanareaname"]').exists();
  });

  test('SEQRA or CEQR sub Q shows conditionally', async function (assert) {
    this.server.create('project', 1, 'applicant');

    await visit('/pas-form/1/edit');

    assert.dom('[data-test-input="dcpPleaseexplaintypeiienvreview"]').doesNotExist();
    await click('[data-test-radio="dcpLanduseactiontype2"][data-test-radio-option="Yes"]');
    assert.dom('[data-test-input="dcpPleaseexplaintypeiienvreview"]').exists();
  });

  test('Industrial Business Zone sub Q shows conditionally', async function (assert) {
    this.server.create('project', 1, 'applicant');

    await visit('/pas-form/1/edit');

    assert.dom('[data-test-input="dcpProjectareaindutrialzonename"]').doesNotExist();
    await click('[data-test-radio="dcpProjectareaindustrialbusinesszone"][data-test-radio-option="Yes"]');
    assert.dom('[data-test-input="dcpProjectareaindutrialzonename"]').exists();
  });

  test('Landmark or Historic District sub Q shows conditionally', async function (assert) {
    this.server.create('project', 1, 'applicant');

    await visit('/pas-form/1/edit');

    assert.dom('[data-test-input="dcpProjectarealandmarkname"]').doesNotExist();
    await click('[data-test-radio="dcpIsprojectarealandmark"][data-test-radio-option="Yes"]');
    assert.dom('[data-test-input="dcpProjectarealandmarkname"]').exists();
  });

  test('Other Type sub Q shows conditionally', async function (assert) {
    this.server.create('project', 1, 'applicant');

    await visit('/pas-form/1/edit');

    assert.dom('[data-test-input="dcpProposeddevelopmentsiteotherexplanation"]').doesNotExist();
    await click('[data-test-checkbox="dcpProposeddevelopmentsiteinfoother"]');
    assert.dom('[data-test-input="dcpProposeddevelopmentsiteotherexplanation"]').exists();
  });

  test('MIH sub Q shows conditionally', async function (assert) {
    this.server.create('project', 1, 'applicant');

    await visit('/pas-form/1/edit');

    assert.dom('[data-test-input="dcpInclusionaryhousingdesignatedareaname"]').doesNotExist();
    await click('[data-test-radio="dcpIsinclusionaryhousingdesignatedarea"][data-test-radio-option="Yes"]');
    assert.dom('[data-test-input="dcpInclusionaryhousingdesignatedareaname"]').exists();
  });

  test('Funding Source sub Q shows conditionally', async function (assert) {
    this.server.create('project', 1, 'applicant');

    await visit('/pas-form/1/edit');

    assert.dom('[data-test-radio="dcpHousingunittype"][data-test-radio-option="City"]').doesNotExist();
    assert.dom('[data-test-radio="dcpHousingunittype"][data-test-radio-option="State"]').doesNotExist();
    assert.dom('[data-test-radio="dcpHousingunittype"][data-test-radio-option="Federal"]').doesNotExist();
    assert.dom('[data-test-radio="dcpHousingunittype"][data-test-radio-option="Other"]').doesNotExist();

    await click('[data-test-radio="dcpDiscressionaryfundingforffordablehousing"][data-test-radio-option="Yes"]');
    assert.dom('[data-test-radio="dcpHousingunittype"][data-test-radio-option="City"]').exists();
    assert.dom('[data-test-radio="dcpHousingunittype"][data-test-radio-option="State"]').exists();
    assert.dom('[data-test-radio="dcpHousingunittype"][data-test-radio-option="Federal"]').exists();
    assert.dom('[data-test-radio="dcpHousingunittype"][data-test-radio-option="Other"]').exists();
  });

  test('user can save pas form', async function (assert) {
    this.server.create('project', 1, 'applicant');

    await visit('/pas-form/1/edit');

    // save button should start disabled
    // TODO: fix this test.  The form starts dirty because we implicitly create a new applicant when the applicants array is empty
    // assert.dom('[data-test-save-button').hasProperty('disabled', true);

    // edit a field to make it pasForm dirty
    await fillIn('[data-test-input="dcpRevisedprojectname"]', 'Some Cool New Project Name');

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
    await visit('/pas-form/1/edit');

    await fillIn('[data-test-input="dcpRevisedprojectname"]', 'my project name');

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

    await visit('/pas-form/1/edit');

    await fillIn('[data-test-input="dcpRevisedprojectname"]', 'my project name');

    assert.dom('[data-test-save-button]').hasNoAttribute('disabled');
    assert.dom('[data-test-submit-button]').hasNoAttribute('disabled');

    await click('[data-test-radio="dcpUrbanrenewalarea"][data-test-radio-option="Yes"]');

    assert.dom('[data-test-validation-message="dcpUrbanareaname"]').exists();
    assert.dom('[data-test-save-button]').hasNoAttribute('disabled');
    assert.dom('[data-test-submit-button]').hasAttribute('disabled');

    await fillIn('[data-test-input="dcpUrbanareaname"]', 'abc');

    assert.dom('[data-test-validation-message="dcpUrbanareaname"]').doesNotExist();
    assert.dom('[data-test-save-button]').hasNoAttribute('disabled');
    assert.dom('[data-test-submit-button]').hasNoAttribute('disabled');

    await fillIn('[data-test-input="dcpUrbanareaname"]', '');

    assert.dom('[data-test-validation-message="dcpUrbanareaname"]').exists('it revalidates');
    assert.dom('[data-test-save-button]').hasNoAttribute('disabled');
    assert.dom('[data-test-submit-button]').hasAttribute('disabled');
  });

  test('It sends an associated project to the server, and associates the correct project', async function (assert) {
    this.server.create('package', 1, {
      pasForm: this.server.create('pas-form'),
      project: this.server.create('project', { id: '42' }),
    });

    await visit('/pas-form/1/edit');
    await fillIn('[data-test-section="project-geography"] .map-search-input', '1000120001');
    await triggerKeyEvent('[data-test-section="project-geography"] .labs-geosearch', 'keypress', 13);
    await click('[data-test-save-button]');

    assert.equal(this.server.db.bbls.firstObject.projectId, '42');
  });

  test('Docs appear in attachments section when visiting from another route', async function(assert) {
    this.server.create('package', 'applicant', 'withExistingDocuments', {
      id: '1',
      project: this.server.create('project'),
    });

    // simulate a "sparse fieldset"
    this.server.get('/projects', function (schema) {
      const projects = schema.projects.all();
      const json = this.serialize(projects);

      json.included[0].attributes.documents = [];

      return json;
    });

    await visit('/projects');
    await click('[data-test-project="edit-pas"]');

    assert.dom('[data-test-section="attachments"').hasTextContaining('PAS Form.pdf');
  });

  test('For input dependent on radio button/checkbox -- when user fills out input, then clicks radio button/checkbox that hides input, text is not saved to model', async function(assert) {
    this.server.create('package', 1, {
      pasForm: this.server.create('pas-form'),
      project: this.server.create('project'),
    });

    await visit('/pas-form/1/edit');

    // dcpInclusionaryhousingdesignatedareaname (radio button) -----------------------------------------
    // user selects "Yes" radio button and fills out input, then saves
    await click('[data-test-radio="dcpIsinclusionaryhousingdesignatedarea"][data-test-radio-option="Yes"]');
    await fillIn('[data-test-input="dcpInclusionaryhousingdesignatedareaname"]', 'bananas');
    await click('[data-test-save-button]');
    await settled();
    assert.equal(this.server.db.pasForms[0].dcpInclusionaryhousingdesignatedareaname, 'bananas');
    // user selects "No" radio button and fills out input, then saves
    await click('[data-test-radio="dcpIsinclusionaryhousingdesignatedarea"][data-test-radio-option="No"]');
    await click('[data-test-save-button]');
    await settled();
    // clicking on the radio button should set the value to an empty string
    assert.equal(this.server.db.pasForms[0].dcpInclusionaryhousingdesignatedareaname, '');
    // user re-selects "Yes" radio button and re-fills out input, then saves
    await click('[data-test-radio="dcpIsinclusionaryhousingdesignatedarea"][data-test-radio-option="Yes"]');
    await fillIn('[data-test-input="dcpInclusionaryhousingdesignatedareaname"]', 'peaches');
    await click('[data-test-save-button]');
    await settled();
    assert.equal(this.server.db.pasForms[0].dcpInclusionaryhousingdesignatedareaname, 'peaches');

    // dcpProposeddevelopmentsiteotherexplanation (checkbox) -----------------------------------------
    // user selects checkbox and fills out input, then saves
    await click('[data-test-checkbox="dcpProposeddevelopmentsiteinfoother"]');
    await fillIn('[data-test-input="dcpProposeddevelopmentsiteotherexplanation"]', 'pecan pie');
    await click('[data-test-save-button]');
    await settled();
    assert.equal(this.server.db.pasForms[0].dcpProposeddevelopmentsiteotherexplanation, 'pecan pie');
    await click('[data-test-checkbox="dcpProposeddevelopmentsiteinfoother"]');
    await click('[data-test-save-button]');
    await settled();
    // clicking the checkbox should set the value to an empty string
    assert.equal(this.server.db.pasForms[0].dcpProposeddevelopmentsiteotherexplanation, '');
    // user re-selects checkbox and re-fills out input, then saves
    await click('[data-test-checkbox="dcpProposeddevelopmentsiteinfoother"]');
    await fillIn('[data-test-input="dcpProposeddevelopmentsiteotherexplanation"]', 'strawberry rhubarb');
    await click('[data-test-save-button]');
    await settled();
    assert.equal(this.server.db.pasForms[0].dcpProposeddevelopmentsiteotherexplanation, 'strawberry rhubarb');
  });
});