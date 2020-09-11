import { module, test } from 'qunit';
import {
  visit,
  click,
  currentURL,
  settled,
  fillIn,
  waitFor,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { authenticateSession } from 'ember-simple-auth/test-support';

const saveForm = async () => {
  await click('[data-test-save-button]');
  await settled();
};

module('Acceptance | user can click landuse form edit', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(() => {
    authenticateSession({
      emailaddress1: 'me@me.com',
    });
  });

  test('User can edit, save and submit landuse form', async function(assert) {
    this.server.create('project', 1, {
      packages: [this.server.create('package', 'toDo', 'landuseForm')],
    });

    await visit('/landuse-form/1/edit');

    await click('[data-test-add-applicant-button]');
    await fillIn('[data-test-input="dcpFirstname"]', 'Tess');
    await fillIn('[data-test-input="dcpLastname"]', 'Ter');
    await fillIn('[data-test-input="dcpEmail"]', 'tesster@planning.nyc.gov');
    await click('[data-test-save-button]');

    await waitFor('[data-test-submit-button]:not([disabled])');
    await click('[data-test-submit-button]');
    await click('[data-test-confirm-submit-button]');

    await settled();

    await waitFor('[data-test-show="dcpProjectname"]');

    assert.equal(currentURL(), '/landuse-form/1');
  });

  test('User can edit Site Information on the landuse form', async function(assert) {
    this.server.create('project', 1, {
      packages: [this.server.create('package', 'toDo', 'landuseForm')],
    });

    await visit('/landuse-form/1/edit');

    await fillIn('[data-test-input="dcpSitedataadress"]', 'Some value');
    await fillIn('[data-test-input="dcpCitycouncil"]', 'Some value');
    await fillIn('[data-test-input="dcpSitedatacommunitydistrict"]', 'Some value');
    await fillIn('[data-test-input="dcpSitedatazoningsectionnumbers"]', 'Some value');
    await fillIn('[data-test-input="dcpSitedataexistingzoningdistrict"]', 'Some value');
    await fillIn('[data-test-input="dcpSpecialdistricts"]', 'Some value');

    await click('[data-test-save-button]');

    assert.equal(this.server.db.landuseForms.firstObject.dcpSitedataadress, 'Some value');
    assert.equal(this.server.db.landuseForms.firstObject.dcpCitycouncil, 'Some value');
    assert.equal(this.server.db.landuseForms.firstObject.dcpSitedatacommunitydistrict, 'Some value');
    assert.equal(this.server.db.landuseForms.firstObject.dcpSitedatazoningsectionnumbers, 'Some value');
    assert.equal(this.server.db.landuseForms.firstObject.dcpSitedataexistingzoningdistrict, 'Some value');
    assert.equal(this.server.db.landuseForms.firstObject.dcpSpecialdistricts, 'Some value');

    assert.equal(currentURL(), '/landuse-form/1/edit');
  });

  test('User can reveal Project Area conditional questions', async function(assert) {
    this.server.create('project', 1, {
      packages: [this.server.create('package', 'toDo', 'landuseForm')],
    });

    await visit('/landuse-form/1/edit');

    assert.dom('[data-test-radio="dcpEntiretyboroughs"]').doesNotExist();

    await click('[data-test-radio="dcpWholecity"][data-test-radio-option="Yes"]');

    assert.dom('[data-test-radio="dcpEntiretyboroughs"]').doesNotExist();

    await click('[data-test-radio="dcpWholecity"][data-test-radio-option="No"]');

    assert.dom('[data-test-radio="dcpEntiretyboroughs"]').exists();


    assert.dom('[data-test-input="dcpBoroughs"]').doesNotExist();
    assert.dom('[data-test-radio="dcpEntiretycommunity"]').doesNotExist();

    await click('[data-test-radio="dcpEntiretyboroughs"][data-test-radio-option="Yes"]');

    assert.dom('[data-test-input="dcpBoroughs"]').exists();
    assert.dom('[data-test-radio="dcpEntiretycommunity"]').doesNotExist();

    await click('[data-test-radio="dcpEntiretyboroughs"][data-test-radio-option="No"]');

    assert.dom('[data-test-input="dcpBoroughs"]').doesNotExist();
    assert.dom('[data-test-radio="dcpEntiretycommunity"]').exists();


    assert.dom('[data-test-input="dcpCommunity"]').doesNotExist();
    assert.dom('[data-test-radio="dcpNotaxblock"]').doesNotExist();

    await click('[data-test-radio="dcpEntiretycommunity"][data-test-radio-option="Yes"]');

    assert.dom('[data-test-input="dcpCommunity"]').exists();
    assert.dom('[data-test-radio="dcpNotaxblock"]').doesNotExist();

    await click('[data-test-radio="dcpEntiretycommunity"][data-test-radio-option="No"]');

    assert.dom('[data-test-input="dcpCommunity"]').doesNotExist();
    assert.dom('[data-test-radio="dcpNotaxblock"]').exists();


    assert.dom('[data-test-input="dcpSitedatapropertydescription"]').doesNotExist();

    await click('[data-test-radio="dcpNotaxblock"][data-test-radio-option="Yes"]');

    assert.dom('[data-test-input="dcpSitedatapropertydescription"]').exists();

    assert.dom('[data-test-input="dcpZonesspecialdistricts"]').doesNotExist();
    assert.dom('[data-test-radio="dcpStateczm"]').doesNotExist();
    assert.dom('[data-test-radio="dcpHistoricdistrict"]').doesNotExist();
    assert.dom('[data-test-input="dcpSitedatarenewalarea"]').doesNotExist();

    await click('[data-test-radio="dcpNotaxblock"][data-test-radio-option="No"]');

    assert.dom('[data-test-input="dcpSitedatapropertydescription"]').doesNotExist();

    assert.dom('[data-test-input="dcpZonesspecialdistricts"]').exists();
    assert.dom('[data-test-radio="dcpStateczm"]').exists();
    assert.dom('[data-test-radio="dcpHistoricdistrict"]').exists();
    assert.dom('[data-test-input="dcpSitedatarenewalarea"]').doesNotExist();

    await click('[data-test-radio="dcpHistoricdistrict"][data-test-radio-option="Yes"]');

    assert.dom('[data-test-input="dcpSitedatarenewalarea"]').exists();

    assert.equal(currentURL(), '/landuse-form/1/edit');
  });

  test('User resets values of all radio descendants when changing radio answers in Project Area', async function(assert) {
    this.server.create('project', 1, {
      packages: [this.server.create('package', 'toDo', 'landuseForm')],
    });

    await visit('/landuse-form/1/edit');

    await click('[data-test-radio="dcpWholecity"][data-test-radio-option="No"]');
    await click('[data-test-radio="dcpEntiretyboroughs"][data-test-radio-option="No"]');
    await click('[data-test-radio="dcpEntiretycommunity"][data-test-radio-option="No"]');
    await click('[data-test-radio="dcpNotaxblock"][data-test-radio-option="Yes"]');
    await fillIn('[data-test-input="dcpSitedatapropertydescription"]', 'Planning');

    await assert.dom('[data-test-input="dcpSitedatapropertydescription"]').hasValue('Planning');

    await click('[data-test-radio="dcpNotaxblock"][data-test-radio-option="No"]');
    await click('[data-test-radio="dcpNotaxblock"][data-test-radio-option="Yes"]');

    await assert.dom('[data-test-input="dcpSitedatapropertydescription"]').hasNoValue();

    await fillIn('[data-test-input="dcpSitedatapropertydescription"]', 'Planning');

    await assert.dom('[data-test-input="dcpSitedatapropertydescription"]').hasValue('Planning');

    await click('[data-test-radio="dcpWholecity"][data-test-radio-option="Yes"]');
    await click('[data-test-radio="dcpWholecity"][data-test-radio-option="No"]');

    assert.dom('[data-test-radio="dcpEntiretycommunity"]').doesNotExist();

    await click('[data-test-radio="dcpEntiretyboroughs"][data-test-radio-option="No"]');

    assert.dom('[data-test-radio="dcpNotaxblock"]').doesNotExist();

    await click('[data-test-radio="dcpEntiretycommunity"][data-test-radio-option="No"]');

    assert.dom('[data-test-input="dcpSitedatapropertydescription"]').doesNotExist();

    await click('[data-test-radio="dcpNotaxblock"][data-test-radio-option="Yes"]');

    assert.dom('[data-test-input="dcpSitedatapropertydescription"]').exists();

    await assert.dom('[data-test-input="dcpSitedatapropertydescription"]').hasNoValue();

    assert.equal(currentURL(), '/landuse-form/1/edit');
  });

  test('User is required to fill out Proposed Development Site conditional fields', async function(assert) {
    this.server.create('project', 1, {
      packages: [this.server.create('package', 'toDo', 'landuseForm')],
    });

    await visit('/landuse-form/1/edit');

    // fill out other necessary fields for saving
    await click('[data-test-add-applicant-button]');
    await fillIn('[data-test-input="dcpFirstname"]', 'Tess');
    await fillIn('[data-test-input="dcpLastname"]', 'Ter');
    await fillIn('[data-test-input="dcpEmail"]', 'tesster@planning.nyc.gov');
    await click('[data-test-save-button]');

    assert.dom('[data-test-submit-button]').hasNoAttribute('disabled');

    await click('[data-test-radio="dcpWholecity"][data-test-radio-option="No"]');
    await click('[data-test-radio="dcpEntiretyboroughs"][data-test-radio-option="No"]');
    await click('[data-test-radio="dcpEntiretycommunity"][data-test-radio-option="No"]');
    await click('[data-test-radio="dcpNotaxblock"][data-test-radio-option="No"]');

    await click('[data-test-radio="dcp500kpluszone"][data-test-radio-option="No"]');

    assert.dom('[data-test-submit-button]').hasNoAttribute('disabled');
    assert.dom('[data-test-validation-message="dcpDevsize"]').doesNotExist();

    await click('[data-test-radio="dcp500kpluszone"][data-test-radio-option="Yes"]');

    assert.dom('[data-test-submit-button]').hasAttribute('disabled');
    assert.dom('[data-test-validation-message="dcpDevsize"]').containsText('required');

    await click('[data-test-radio="dcpDevsize"][data-test-radio-option="500,000 to 999,999 zoning sq ft"]');

    assert.dom('[data-test-submit-button]').hasNoAttribute('disabled');
    assert.dom('[data-test-validation-message="dcpDevsize"]').doesNotExist();

    await click('[data-test-radio="dcpSitedatasiteisinnewyorkcity"][data-test-radio-option="No"]');

    assert.dom('[data-test-submit-button]').hasNoAttribute('disabled');
    assert.dom('[data-test-validation-message="dcpSitedataidentifylandmark"]').doesNotExist();

    await click('[data-test-radio="dcpSitedatasiteisinnewyorkcity"][data-test-radio-option="Yes"]');

    assert.dom('[data-test-submit-button]').hasAttribute('disabled');
    assert.dom('[data-test-validation-message="dcpSitedataidentifylandmark"]').exists();

    await fillIn('[data-test-input="dcpSitedataidentifylandmark"]', 'Douglas Fir');

    assert.dom('[data-test-submit-button]').hasNoAttribute('disabled');
    assert.dom('[data-test-validation-message="dcpSitedataidentifylandmark"]').doesNotExist();
  });

  test('User can add an applicant on the landuse form', async function(assert) {
    this.server.create('project', 1, {
      packages: [this.server.create('package', 'toDo', 'landuseForm')],
    });

    await visit('/landuse-form/1/edit');

    await click('[data-test-add-applicant-button]');
    await fillIn('[data-test-input="dcpFirstname"]', 'Tess');
    await fillIn('[data-test-input="dcpLastname"]', 'Ter');
    await fillIn('[data-test-input="dcpEmail"]', 'tesster@planning.nyc.gov');
    await click('[data-test-save-button]');

    assert.equal(this.server.db.applicants.firstObject.dcpFirstname, 'Tess');

    assert.equal(currentURL(), '/landuse-form/1/edit');
  });

  test('User can add and a related action on the landuse form', async function(assert) {
    this.server.create('project', 1, {
      packages: [this.server.create('package', 'toDo', 'landuseForm')],
    });

    await visit('/landuse-form/1/edit');

    // fill out other necessary fields for saving
    await click('[data-test-add-applicant-button]');
    await fillIn('[data-test-input="dcpFirstname"]', 'Tess');
    await fillIn('[data-test-input="dcpLastname"]', 'Ter');
    await fillIn('[data-test-input="dcpEmail"]', 'tesster@planning.nyc.gov');

    // add and fill out fields for related action
    await click('[data-test-add-related-action-button]');
    await click('[data-test-action-completed="true"]');
    await fillIn('[data-test-input="dcpReferenceapplicationno"]', '12345678');
    await fillIn('[data-test-input="dcpApplicationdescription"]', 'applicant description');
    await fillIn('[data-test-input="dcpDispositionorstatus"]', 'disposition or status');
    await fillIn('[data-test-input="dcpCalendarnumbercalendarnumber"]', 'calendar number');
    await fillIn('[data-test-input="dcpApplicationdate"]', 'application date');
    await click('[data-test-save-button]');

    assert.equal(this.server.db.applicants.firstObject.dcpFirstname, 'Tess');
    assert.equal(this.server.db.relatedActions.firstObject.dcpReferenceapplicationno, '12345678');
  });

  test('User can fill out and save first part of Housing Plans', async function(assert) {
    this.server.create('project', 1, {
      packages: [this.server.create('package', 'toDo', 'landuseForm')],
    });

    await visit('/landuse-form/1/edit');

    await click('[data-test-radio="dcpDesignation"][data-test-radio-option="No (HC, HD, HO, HP, possibly HU)"]');
    await click('[data-test-radio="dcpDesignation"][data-test-radio-option="Yes (HA, HN, HG, possibly HU)"]');

    await click('[data-test-radio="dcpProjecthousingplanudaap"][data-test-radio-option="No (HC, HD, HO, HP, HU)"]');
    await click('[data-test-radio="dcpProjecthousingplanudaap"][data-test-radio-option="Yes (HA, HN, HG)"]');

    await click('[data-test-radio="dcpDisposition"][data-test-radio-option="No (HC, HD, HG, HN, HO, HP, HU)"]');

    assert.dom('[data-test-radio="dcpMannerofdisposition"]').doesNotExist();
    assert.dom('[data-test-radio="dcpRestrictandcondition"]').doesNotExist();

    await click('[data-test-radio="dcpDisposition"][data-test-radio-option="Yes (HA, HD)"]');

    assert.dom('[data-test-radio="dcpMannerofdisposition"]').exists();
    assert.dom('[data-test-radio="dcpRestrictandcondition"]').exists();
  });

  test('user can remove applicants on landuse form', async function(assert) {
    const project = this.server.create('project', 1, {
      packages: [this.server.create('package', 'toDo', 'landuseForm')],
    });
    const { landuseForm } = project.packages.models[0];
    // create an applicant model
    const serverSideApplicant = this.server.create('applicant', 'organizationApplicant', { landuseForm });
    // get the reference to the model instance
    await this.owner.lookup('service:store').findRecord('applicant', serverSideApplicant.id);

    await visit('/landuse-form/1/edit');

    // remove the applicant
    await click('[data-test-remove-applicant-button');

    // FIXME: user shouldn't see the fieldset
    assert.dom('[data-test-applicant-fieldset="0"]').doesNotExist();

    await saveForm();

    assert.dom('[data-test-applicant-fieldset="0"]').doesNotExist();
  });

  test('user can remove related actions on landuse form', async function(assert) {
    const project = this.server.create('project', 1, {
      packages: [this.server.create('package', 'toDo', 'landuseForm')],
    });
    const { landuseForm } = project.packages.models[0];
    // create a related action model
    const serverSideRelatedAction = this.server.create('related-action', { landuseForm });
    // get the reference to the model instance
    await this.owner.lookup('service:store').findRecord('related-action', serverSideRelatedAction.id);

    await visit('/landuse-form/1/edit');

    // remove the related action
    await click('[data-test-remove-related-action-button]');

    // FIXME: user shouldn't see the fieldset
    assert.dom('[data-test-related-action-fieldset="0"]').doesNotExist();

    await saveForm();

    assert.dom('[data-test-related-action-fieldset="0"]').doesNotExist();
  });

  test('User can update the primary contact information on the landuse form', async function(assert) {
    this.server.create('project', 1, {
      packages: [this.server.create('package', 'toDo', 'landuseForm')],
    });

    await visit('/landuse-form/1/edit');

    // filling out necessary information in order to save
    await click('[data-test-add-applicant-button]');
    await fillIn('[data-test-input="dcpFirstname"]', 'Tess');
    await fillIn('[data-test-input="dcpLastname"]', 'Ter');
    await fillIn('[data-test-input="dcpEmail"]', 'tesster@planning.nyc.gov');

    // filling out the primary contact information
    await fillIn('[data-test-input="dcpContactname"]', 'contact name');
    await fillIn('[data-test-input="dcpContactphone"]', '1112223333');
    await fillIn('[data-test-input="dcpContactemail"]', 'contact@email.com');

    await click('[data-test-save-button]');

    assert.equal(this.server.db.landuseForms.firstObject.dcpContactname, 'contact name');
    assert.equal(this.server.db.landuseForms.firstObject.dcpContactphone, '1112223333');
    assert.equal(this.server.db.landuseForms.firstObject.dcpContactemail, 'contact@email.com');

    assert.equal(currentURL(), '/landuse-form/1/edit');
  });

  test('User can update the project name on the landuse form', async function(assert) {
    this.server.create('project', 1, {
      packages: [this.server.create('package', 'toDo', 'landuseForm')],
    });

    await visit('/landuse-form/1/edit');

    // filling out necessary information in order to save
    await click('[data-test-add-applicant-button]');
    await fillIn('[data-test-input="dcpFirstname"]', 'Tess');
    await fillIn('[data-test-input="dcpLastname"]', 'Ter');
    await fillIn('[data-test-input="dcpEmail"]', 'tesster@planning.nyc.gov');

    // filling out the project name information
    await fillIn('[data-test-input="dcpProjectname"]', 'new project name');

    await click('[data-test-save-button]');

    assert.equal(this.server.db.projects.firstObject.dcpProjectname, 'new project name');

    assert.equal(currentURL(), '/landuse-form/1/edit');
  });

  test('User can update the environmental review information on the landuse form', async function(assert) {
    this.server.create('project', 1, {
      packages: [this.server.create('package', 'toDo', 'landuseForm')],
    });

    await visit('/landuse-form/1/edit');

    // filling out necessary information in order to save
    await click('[data-test-add-applicant-button]');
    await fillIn('[data-test-input="dcpFirstname"]', 'Tess');
    await fillIn('[data-test-input="dcpLastname"]', 'Ter');
    await fillIn('[data-test-input="dcpEmail"]', 'tesster@planning.nyc.gov');

    // filling out the primary contact information
    await fillIn('[data-test-input="dcpCeqrnumber"]', '12345');
    await click('[data-test-radio="dcpCeqrtype"][data-test-radio-option="Type II"]');
    await fillIn('[data-test-input="dcpTypecategory"]', 'type category');

    await click('[data-test-save-button]');

    assert.equal(this.server.db.landuseForms.firstObject.dcpCeqrnumber, '12345');
    assert.equal(this.server.db.landuseForms.firstObject.dcpCeqrtype, 717170001);
    assert.equal(this.server.db.landuseForms.firstObject.dcpTypecategory, 'type category');

    assert.equal(currentURL(), '/landuse-form/1/edit');
  });

  test('User only sees last questions under Project Area, Proposed Development Site, Project Tax Lots when project applies to partial area', async function(assert) {
    this.server.create('project', 1, {
      packages: [this.server.create('package', 'toDo', 'landuseForm')],
    });

    await visit('/landuse-form/1/edit');

    assert.dom('[data-test-input="dcpZonesspecialdistricts"]').doesNotExist();
    assert.dom('[data-test-radio="dcpStateczm"]').doesNotExist();
    assert.dom('[data-test-radio="dcpHistoricdistrict"]').doesNotExist();
    assert.dom('[data-test-input="dcpSitedatarenewalarea"]').doesNotExist();
    assert.dom('[data-test-section="proposed-development-site"]').doesNotExist();
    assert.dom('[data-test-section="project-area-tax-lots"]').doesNotExist();

    assert.dom('[data-test-section="proposed-development-site"]').doesNotExist();
    assert.dom('[data-test-section="project-area-tax-lots"]').doesNotExist();

    await click('[data-test-radio="dcpWholecity"][data-test-radio-option="No"]');
    await click('[data-test-radio="dcpEntiretyboroughs"][data-test-radio-option="No"]');
    await click('[data-test-radio="dcpEntiretycommunity"][data-test-radio-option="No"]');

    assert.dom('[data-test-input="dcpZonesspecialdistricts"]').doesNotExist();
    assert.dom('[data-test-radio="dcpStateczm"]').doesNotExist();
    assert.dom('[data-test-radio="dcpHistoricdistrict"]').doesNotExist();
    assert.dom('[data-test-input="dcpSitedatarenewalarea"]').doesNotExist();
    assert.dom('[data-test-section="proposed-development-site"]').doesNotExist();
    assert.dom('[data-test-section="project-area-tax-lots"]').doesNotExist();

    await click('[data-test-radio="dcpNotaxblock"][data-test-radio-option="No"]');

    assert.dom('[data-test-input="dcpZonesspecialdistricts"]').exists();
    assert.dom('[data-test-radio="dcpStateczm"]').exists();
    assert.dom('[data-test-radio="dcpHistoricdistrict"]').exists();
    assert.dom('[data-test-section="proposed-development-site"]').exists();
    assert.dom('[data-test-section="project-area-tax-lots"]').exists();

    assert.dom('[data-test-input="dcpSitedatarenewalarea"]').doesNotExist();

    await click('[data-test-radio="dcpHistoricdistrict"][data-test-radio-option="Yes"]');

    assert.dom('[data-test-input="dcpSitedatarenewalarea"]').exists();
  });
});
