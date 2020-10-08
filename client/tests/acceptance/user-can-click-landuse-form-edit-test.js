import { module, test } from 'qunit';
import {
  visit,
  click,
  currentURL,
  settled,
  fillIn,
  waitFor,
  triggerKeyEvent,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { authenticateSession } from 'ember-simple-auth/test-support';
import { selectChoose } from 'ember-power-select/test-support';
import exceedMaximum from '../helpers/exceed-maximum-characters';

const saveForm = async () => {
  await click('[data-test-save-button]');
  await settled();
};

module('Acceptance | user can click landuse form edit', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(() => {
    authenticateSession({
      emailaddress1: 'me@me.com',
    });
  });

  test('User can edit, save and submit landuse form', async function (assert) {
    this.server.create('project', 1, {
      packages: [this.server.create('package', 'toDo', 'landuseForm')],
    });

    await visit('/landuse-form/1/edit');

    await click('[data-test-add-applicant-button]');
    await fillIn('[data-test-input="dcpFirstname"]', 'Tess');
    await fillIn('[data-test-input="dcpLastname"]', 'Ter');
    await fillIn('[data-test-input="dcpEmail"]', 'tesster@planning.nyc.gov');

    // filling out the proposed actions section
    await click('[data-test-radio="dcpApplicantispublicagencyactions"][data-test-action="ZC"][data-test-radio-option="Yes"]');
    await click('[data-test-radio="dcpApplicantispublicagencyactions"][data-test-action="ZA"][data-test-radio-option="No"]');
    await click('[data-test-radio="dcpApplicantispublicagencyactions"][data-test-action="MM"][data-test-radio-option="Yes"]');

    await click('[data-test-save-button]');
    await waitFor('[data-test-submit-button]:not([disabled])');
    await click('[data-test-submit-button]');
    await click('[data-test-confirm-submit-button]');

    await settled();

    await waitFor('[data-test-show="dcpProjectname"]');

    assert.equal(currentURL(), '/landuse-form/1');
  });

  test('User can edit Site Information on the landuse form', async function (assert) {
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

  test('User can reveal Project Area conditional questions', async function (assert) {
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

  test('User resets values of all radio descendants when changing radio answers in Project Area', async function (assert) {
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

  test('User is required to fill out Proposed Development Site conditional fields', async function (assert) {
    this.server.create('project', 1, {
      packages: [this.server.create('package', 'toDo', 'landuseForm')],
    });

    await visit('/landuse-form/1/edit');

    // fill out other necessary fields for saving
    await click('[data-test-add-applicant-button]');
    await fillIn('[data-test-input="dcpFirstname"]', 'Tess');
    await fillIn('[data-test-input="dcpLastname"]', 'Ter');
    await fillIn('[data-test-input="dcpEmail"]', 'tesster@planning.nyc.gov');
    await click('[data-test-radio="dcpApplicantispublicagencyactions"][data-test-action="ZC"][data-test-radio-option="Yes"]');
    await click('[data-test-radio="dcpApplicantispublicagencyactions"][data-test-action="ZA"][data-test-radio-option="No"]');
    await click('[data-test-radio="dcpApplicantispublicagencyactions"][data-test-action="MM"][data-test-radio-option="Yes"]');
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

  test('User can add an applicant on the landuse form', async function (assert) {
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

  test('User can add and a related action on the landuse form', async function (assert) {
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

  test('User can fill out and save first part of Housing Plans', async function (assert) {
    // Create a land use form with housing-related actions
    this.server.create('project', {
      packages: [
        this.server.create('package', 'toDo', {
          dcpPackagetype: 717170001,
          landuseForm: this.server.create('landuse-form', {
            landuseActions: [
              this.server.create('landuse-action', {
                dcpActioncode: 'ZC',
              }),
              this.server.create('landuse-action', {
                dcpActioncode: 'HO',
              }),
            ],
          }),
        }),
      ],
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

  test('Housing sections only appear if Project contains housing-related Land Use Actions', async function (assert) {
    // The Package Factory's landuseForm trait creates a Land Use Form
    // with only the ZC and ZA Land Use Actions, which in the list of
    // housing-related actions
    const projectWithoutHousingAction = this.server.create('project', {
      packages: [
        this.server.create('package', 'toDo', 'landuseForm'),
      ],
    });

    // The housing-related Land Use Actions are
    // 'HA', 'HC', 'HD', 'HG', 'HN', 'HO', 'HP', 'HU'
    const projectWithHousingAction = this.server.create('project', {
      packages: [
        this.server.create('package', 'toDo', {
          dcpPackagetype: 717170001,
          landuseForm: this.server.create('landuse-form', {
            landuseActions: [
              this.server.create('landuse-action', {
                dcpActioncode: 'ZC',
              }),
              this.server.create('landuse-action', {
                dcpActioncode: 'HO',
              }),
            ],
          }),
        }),
      ],
    });

    await visit(`/landuse-form/${projectWithoutHousingAction.id}/edit`);

    assert.dom('[data-test-section="housing-plans"]').doesNotExist();

    await visit(`/landuse-form/${projectWithHousingAction.id}/edit`);

    assert.dom('[data-test-section="housing-plans"]').exists();
  });

  test('user can remove applicants on landuse form', async function (assert) {
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

  test('user can remove related actions on landuse form', async function (assert) {
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

  test('User can update the primary contact information on the landuse form', async function (assert) {
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

  test('User can update the project name on the landuse form', async function (assert) {
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

  test('User can update the environmental review information on the landuse form', async function (assert) {
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

  test('User only sees last questions under Project Area, Proposed Development Site, Project Tax Lots when project applies to partial area', async function (assert) {
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

  test('User can update proposed actions section', async function (assert) {
    this.server.create('project', 1, {
      packages: [this.server.create('package', 'toDo', 'landuseForm')],
    });

    await visit('/landuse-form/1/edit');

    // filling out necessary information in order to save
    await click('[data-test-add-applicant-button]');
    await fillIn('[data-test-input="dcpFirstname"]', 'Tess');
    await fillIn('[data-test-input="dcpLastname"]', 'Ter');
    await fillIn('[data-test-input="dcpEmail"]', 'tesster@planning.nyc.gov');

    // filling out Zoning Special Permit, Authorization, and Certification section
    await click('[data-test-checkbox="dcpOwnersubjectproperty"]');
    await click('[data-test-checkbox="dcpLeesseesubjectproperty"]');

    await click('[data-test-dcpotherparties="true"]');

    await click('[data-test-save-button]');

    assert.equal(this.server.db.landuseForms.firstObject.dcpOwnersubjectproperty, true);
    assert.equal(this.server.db.landuseForms.firstObject.dcpLeesseesubjectproperty, true);
    assert.equal(this.server.db.landuseForms.firstObject.dcpIsother, undefined);
    assert.equal(this.server.db.landuseForms.firstObject.dcpLeaseorbuy, undefined);
    assert.equal(this.server.db.landuseForms.firstObject.dcpOtherparties, true);

    // filling out the proposed actions section
    await click('[data-test-radio="dcpLegalinstrument"][data-test-radio-option="Yes"]');
    await selectChoose('[data-test-dcpPreviouslyapprovedactioncode-picker="ZC"]', 'BF');
    await selectChoose('[data-test-dcpPreviouslyapprovedactioncode-picker="ZA"]', 'LD');
    await click('[data-test-radio="dcpApplicantispublicagencyactions"][data-test-action="ZC"][data-test-radio-option="Yes"]');
    await click('[data-test-radio="dcpApplicantispublicagencyactions"][data-test-action="ZA"][data-test-radio-option="No"]');

    await click('[data-test-save-button]');

    assert.equal(this.server.db.landuseForms.firstObject.dcpLegalinstrument, 717170000);
    assert.equal(this.server.db.landuseActions[0].dcpPreviouslyapprovedactioncode, 717170016);
    assert.equal(this.server.db.landuseActions[1].dcpPreviouslyapprovedactioncode, 717170013);
    assert.equal(this.server.db.landuseActions[0].dcpApplicantispublicagencyactions, true);
    assert.equal(this.server.db.landuseActions[1].dcpApplicantispublicagencyactions, false);

    assert.equal(currentURL(), '/landuse-form/1/edit');
  });

  test('User can add, fill out, save and remove Subject Sites subsections', async function (assert) {
    // Create a LU form w housing-related actions
    this.server.create('project', {
      packages: [
        this.server.create('package', 'toDo', {
          dcpPackagetype: 717170001,
          landuseForm: this.server.create('landuse-form', {
            landuseActions: [
              this.server.create('landuse-action', {
                dcpActioncode: 'ZC',
              }),
              this.server.create('landuse-action', {
                dcpActioncode: 'HO',
              }),
            ],
          }),
        }),
      ],
    });

    await visit('/landuse-form/1/edit');

    await click('[data-test-add-sitedatah-form-button]');

    assert.dom('[data-test-subject-site-title]').exists();

    await fillIn('[data-test-input="dcpUrsitenumber"]', '12345');
    await fillIn('[data-test-input="dcpBorough"]', '12345');
    await fillIn('[data-test-input="dcpBlocknumbertext"]', '12345');
    await fillIn('[data-test-input="dcpLotnumberstring"]', '12345');
    await fillIn('[data-test-input="dcpOwner"]', '12345');
    await fillIn('[data-test-input="dcpAddress"]', '12345');
    await fillIn('[data-test-input="dcpZoning"]', '12345');
    await fillIn('[data-test-input="dcpBuildings"]', '12345');
    await fillIn('[data-test-input="dcpExistingstories"]', '12345');
    await fillIn('[data-test-input="dcpExistinguses"]', '12345');
    await fillIn('[data-test-input="dcpCommoccup"]', '12345');
    await fillIn('[data-test-input="dcpDwellingcup"]', '12345');
    await fillIn('[data-test-input="dcpVacant"]', '12345');
    await fillIn('[data-test-input="dcpDwellingvacant"]', '12345');
    await fillIn('[data-test-input="dcpNoofemp"]', '12345');
    await click('[data-test-radio="dcpSitetobedisposed"][data-test-radio-option="Yes"]');
    await click('[data-test-radio="dcpSitetobedisposed"][data-test-radio-option="No"]');
    await fillIn('[data-test-input="dcpProposeduses"]', '12345');

    assert.dom('[data-test-save-button]').hasNoAttribute('disabled');

    saveForm();

    await click('[data-test-remove-sitedatah-form-button]');

    saveForm();

    assert.dom('[data-test-subject-site-title]').doesNotExist();
  });

  test('user can search and add new bbls', async function (assert) {
    const project = this.server.create('project', 1, {
      packages: [this.server.create('package', 'toDo', 'landuseForm')],
    });
    const { landuseForm } = project.packages.models[0];

    this.server.create('bbl', {
      dcpBblnumber: '3071590111',
      dcpDevelopmentsite: null,
      dcpPartiallot: null,
      landuseForm,
    });

    this.server.create('bbl', {
      dcpBblnumber: '3071590115',
      dcpDevelopmentsite: null,
      dcpPartiallot: null,
      landuseForm,
    });

    this.bbls = [
      await this.owner.lookup('service:store').findRecord('bbl', 1),
      await this.owner.lookup('service:store').findRecord('bbl', 2),
    ];

    await visit('/landuse-form/1/edit');

    await click('[data-test-radio="dcpWholecity"][data-test-radio-option="No"]');
    await click('[data-test-radio="dcpEntiretyboroughs"][data-test-radio-option="No"]');
    await click('[data-test-radio="dcpEntiretycommunity"][data-test-radio-option="No"]');
    await click('[data-test-radio="dcpNotaxblock"][data-test-radio-option="No"]');

    // labs-ember-search class for search input
    await fillIn('.map-search-input', '1000120001');
    await triggerKeyEvent('.labs-geosearch', 'keypress', 13);

    assert.dom(this.element).includesText('1 Bowling Green, Manhattan');

    assert.dom('[data-test-bbl-title="1000120001"]').exists();

    // test that user can add more than one bbl
    await fillIn('.map-search-input', '1000030001');
    await triggerKeyEvent('.labs-geosearch', 'keypress', 13);

    assert.dom(this.element).includesText('10 Battery Park, Manhattan');

    assert.dom('[data-test-bbl-title="1000030001"]').exists();
  });

  test('user can remove a bbl', async function (assert) {
    const project = this.server.create('project', 1, {
      packages: [this.server.create('package', 'toDo', 'landuseForm')],
    });
    const { landuseForm } = project.packages.models[0];

    this.server.create('bbl', {
      dcpBblnumber: '3071590111',
      dcpDevelopmentsite: null,
      dcpPartiallot: null,
      landuseForm,
    });

    this.server.create('bbl', {
      dcpBblnumber: '3071590115',
      dcpDevelopmentsite: null,
      dcpPartiallot: null,
      landuseForm,
    });

    this.bbls = [
      await this.owner.lookup('service:store').findRecord('bbl', 1),
      await this.owner.lookup('service:store').findRecord('bbl', 2),
    ];

    await visit('/landuse-form/1/edit');

    await click('[data-test-radio="dcpWholecity"][data-test-radio-option="No"]');
    await click('[data-test-radio="dcpEntiretyboroughs"][data-test-radio-option="No"]');
    await click('[data-test-radio="dcpEntiretycommunity"][data-test-radio-option="No"]');
    await click('[data-test-radio="dcpNotaxblock"][data-test-radio-option="No"]');

    // labs-ember-search class for search input
    await fillIn('.map-search-input', '1000120001');
    await triggerKeyEvent('.labs-geosearch', 'keypress', 13);

    assert.dom('[data-test-bbl-title="3071590115"]').exists();
    assert.dom('[data-test-bbl-title="1000120001"]').exists();

    await click('[data-test-button-remove-bbl="1000120001"]');

    assert.dom('[data-test-bbl-title="3071590115"]').exists();
    assert.dom('[data-test-bbl-title="1000120001"]').doesNotExist();

    await click('[data-test-button-remove-bbl="3071590115"]');

    assert.dom('[data-test-bbl-title="3071590115"]').doesNotExist();
    assert.dom('[data-test-bbl-title="1000120001"]').doesNotExist();
  });

  test('User can fill out Public Facilities section', async function (assert) {
    // Create a LU form w public-facilities-related actions
    this.server.create('project', {
      packages: [
        this.server.create('package', 'toDo', {
          dcpPackagetype: 717170001,
          landuseForm: this.server.create('landuse-form', {
            landuseActions: [
              this.server.create('landuse-action', {
                dcpActioncode: 'PS',
              }),
              this.server.create('landuse-action', {
                dcpActioncode: 'PX',
              }),
            ],
          }),
        }),
      ],
    });

    await visit('/landuse-form/1/edit');

    await click('[data-test-checkbox="dcpOfficespaceleaseopt"]');
    await click('[data-test-checkbox="dcpAcquisitionopt"]');
    await click('[data-test-checkbox="dcpSiteselectionopt"]');
    await click('[data-test-radio="dcpIndicatetypeoffacility"][data-test-radio-option="Local/Neighborhood"]');

    assert.dom('[data-test-input="dcpTextexistingfacility"]').doesNotExist();
    assert.dom('[data-test-radio="dcpExistingfacilityreplacementinanewlocation"]').doesNotExist();

    await click('[data-test-radio="dcpExistingfacilityproposedtoremainopt"][data-test-radio-option="Yes"]');

    assert.dom('[data-test-input="dcpTextexistingfacility"]').exists();
    assert.dom('[data-test-radio="dcpExistingfacilityreplacementinanewlocation"]').doesNotExist();

    await fillIn('[data-test-input="dcpTextexistingfacility"]', 'A while.');

    await click('[data-test-radio="dcpExistingfacilityproposedtoremainopt"][data-test-radio-option="No"]');

    assert.dom('[data-test-input="dcpTextexistingfacility"]').doesNotExist();

    assert.dom('[data-test-input="dcpCurrentfacilitylocation"]').doesNotExist();

    await click('[data-test-radio="dcpExistingfacilityreplacementinanewlocation"][data-test-radio-option="Yes"]');

    assert.dom('[data-test-input="dcpHowlonghasexistingfacilitybeenatthislocat"]').doesNotExist();
    await fillIn('[data-test-input="dcpCurrentfacilitylocation"]', 'Vibrant streets');

    await click('[data-test-radio="dcpExistingfacilityproposedtoremainandexpand"][data-test-radio-option="Yes"]');

    await fillIn('[data-test-input="dcpHowlonghasexistingfacilitybeenatthislocat"]', 'More than a while.');

    await click('[data-test-radio="dcpNewfacilityopt"][data-test-radio-option="Yes"]');
    await click('[data-test-radio="dcpIsprojectlistedinstatementofneedsopt"][data-test-radio-option="Yes"]');

    await fillIn('[data-test-input="dcpIndicatefiscalyears"]', '1997 - 2020');
    await fillIn('[data-test-input="dcpIndicatepgno"]', 'Page 19');
    await click('[data-test-radio="dcpDidboroughpresidentproposealternativesite"][data-test-radio-option="No"]');
    await fillIn('[data-test-input="dcpWhatsite"]', 'Over the hills');
    await fillIn('[data-test-input="dcpCapitalbudgetline"]', 'Line 9001');
    await fillIn('[data-test-input="dcpForfiscalyrs"]', '2010 - 2015');

    assert.ok(true);
  });

  test('Nested (i.e. Cascading, descendant) questions in Public Facilities reset when parent question values change', async function (assert) {
    // Create a LU form w public-facilities-related actions
    this.server.create('project', {
      packages: [
        this.server.create('package', 'toDo', {
          dcpPackagetype: 717170001,
          landuseForm: this.server.create('landuse-form', {
            landuseActions: [
              this.server.create('landuse-action', {
                dcpActioncode: 'PS',
              }),
              this.server.create('landuse-action', {
                dcpActioncode: 'PX',
              }),
            ],
          }),
        }),
      ],
    });

    await visit('/landuse-form/1/edit');

    // Test clearing dependents of dcpExistingfacilityproposedtoremainopt
    await click('[data-test-radio="dcpExistingfacilityproposedtoremainopt"][data-test-radio-option="Yes"]');

    await fillIn('[data-test-input="dcpTextexistingfacility"]', 'A while.');

    assert.dom('[data-test-input="dcpTextexistingfacility"]').hasValue('A while.');

    await click('[data-test-radio="dcpExistingfacilityproposedtoremainopt"][data-test-radio-option="No"]');

    await click('[data-test-radio="dcpExistingfacilityreplacementinanewlocation"][data-test-radio-option="Yes"]');

    assert.dom('[data-test-radio="dcpExistingfacilityreplacementinanewlocation"][data-test-radio-option="Yes"]').hasAria('checked', 'true');
    assert.dom('[data-test-radio="dcpExistingfacilityreplacementinanewlocation"][data-test-radio-option="No"]').hasAria('checked', 'false');

    await fillIn('[data-test-input="dcpCurrentfacilitylocation"]', 'A hip warehouse.');
    assert.dom('[data-test-input="dcpCurrentfacilitylocation"]').hasValue('A hip warehouse.');

    await click('[data-test-radio="dcpExistingfacilityproposedtoremainopt"][data-test-radio-option="Yes"]');

    assert.dom('[data-test-input="dcpTextexistingfacility"]').hasNoValue();

    await click('[data-test-radio="dcpExistingfacilityproposedtoremainopt"][data-test-radio-option="No"]');

    assert.dom('[data-test-radio="dcpExistingfacilityreplacementinanewlocation"][data-test-radio-option="Yes"]').hasAria('checked', 'false');
    assert.dom('[data-test-radio="dcpExistingfacilityreplacementinanewlocation"][data-test-radio-option="No"]').hasAria('checked', 'false');

    await click('[data-test-radio="dcpExistingfacilityreplacementinanewlocation"][data-test-radio-option="Yes"]');
    assert.dom('[data-test-input="dcpCurrentfacilitylocation"]').hasNoValue();

    // Test clearing dependents of dcpExistingfacilityproposedtoremainandexpand
    assert.dom('[data-test-input="dcpHowlonghasexistingfacilitybeenatthislocat"]').doesNotExist();

    await click('[data-test-radio="dcpExistingfacilityproposedtoremainandexpand"][data-test-radio-option="Yes"]');

    await fillIn('[data-test-input="dcpHowlonghasexistingfacilitybeenatthislocat"]', 'Many decades.');
    assert.dom('[data-test-input="dcpHowlonghasexistingfacilitybeenatthislocat"]').hasValue('Many decades.');

    await click('[data-test-radio="dcpExistingfacilityproposedtoremainandexpand"][data-test-radio-option="No"]');
    await click('[data-test-radio="dcpExistingfacilityproposedtoremainandexpand"][data-test-radio-option="Yes"]');

    assert.dom('[data-test-input="dcpHowlonghasexistingfacilitybeenatthislocat"]').hasNoValue();

    // Test clearing dependents of dcpIsprojectlistedinstatementofneedsopt
    assert.dom('[data-test-input="dcpIndicatefiscalyears"]').doesNotExist();

    await click('[data-test-radio="dcpIsprojectlistedinstatementofneedsopt"][data-test-radio-option="Yes"]');

    await fillIn('[data-test-input="dcpIndicatefiscalyears"]', 'Many decades.');
    assert.dom('[data-test-input="dcpIndicatefiscalyears"]').hasValue('Many decades.');

    await click('[data-test-radio="dcpIsprojectlistedinstatementofneedsopt"][data-test-radio-option="No"]');
    await click('[data-test-radio="dcpIsprojectlistedinstatementofneedsopt"][data-test-radio-option="Yes"]');

    assert.dom('[data-test-input="dcpIndicatefiscalyears"]').hasNoValue();

    await visit('/landuse-form/1/edit');
  });

  test('User can update Change in City Map section', async function (assert) {
    this.server.create('project', 1, {
      packages: [this.server.create('package', 'toDo', 'landuseForm')],
    });

    await visit('/landuse-form/1/edit');

    // filling out necessary information in order to save
    await click('[data-test-add-applicant-button]');
    await fillIn('[data-test-input="dcpFirstname"]', 'Tess');
    await fillIn('[data-test-input="dcpLastname"]', 'Ter');
    await fillIn('[data-test-input="dcpEmail"]', 'tesster@planning.nyc.gov');

    await click('[data-test-checkbox="dcpEstablishstreetopt"]');
    await click('[data-test-checkbox="dcpEasement1"]');

    await click('[data-test-save-button]');

    assert.equal(this.server.db.landuseForms.firstObject.dcpEstablishstreetopt, true);
    assert.equal(this.server.db.landuseForms.firstObject.dcpEstablishparkopt, undefined);
    assert.equal(this.server.db.landuseForms.firstObject.dcpEstablishpublicplaceopt, undefined);
    assert.equal(this.server.db.landuseForms.firstObject.dcpEstablishgradeopt, undefined);
    assert.equal(this.server.db.landuseForms.firstObject.dcpEasement1, true);

    await click('[data-test-checkbox="dcpEliminatestreetopt"]');
    await click('[data-test-checkbox="dcpEasement2"]');

    await click('[data-test-save-button]');

    assert.equal(this.server.db.landuseForms.firstObject.dcpEliminatestreetopt, true);
    assert.equal(this.server.db.landuseForms.firstObject.dcpEliminateparkopt, undefined);
    assert.equal(this.server.db.landuseForms.firstObject.dcpEliminatepublicplaceopt, undefined);
    assert.equal(this.server.db.landuseForms.firstObject.dcpEliminategradeopt, undefined);
    assert.equal(this.server.db.landuseForms.firstObject.dcpEasement2, true);

    await click('[data-test-checkbox="dcpChangestreetwidthopt"]');
    await click('[data-test-checkbox="dcpEasement3"]');

    await click('[data-test-save-button]');

    assert.equal(this.server.db.landuseForms.firstObject.dcpChangestreetwidthopt, true);
    assert.equal(this.server.db.landuseForms.firstObject.dcpChangestreetalignmentopt, undefined);
    assert.equal(this.server.db.landuseForms.firstObject.dcpChangestreetgradeopt, undefined);
    assert.equal(this.server.db.landuseForms.firstObject.dcpEasement3, true);

    await click('[data-test-radio="dcpRelatedacquisitionofpropertyopt"][data-test-radio-option="Yes"]');
    await click('[data-test-related-acquisition="true"]');
    await click('[data-test-radio="dcpOnlychangetheeliminationofamappedbutunimp"][data-test-radio-option="No"]');

    await click('[data-test-save-button]');

    assert.equal(this.server.db.landuseForms.firstObject.dcpRelatedacquisitionofpropertyopt, 1);
    assert.equal(this.server.db.landuseForms.firstObject.dcpRelatedacquisition, true);
    assert.equal(this.server.db.landuseForms.firstObject.dcpOnlychangetheeliminationofamappedbutunimp, 717170001);

    assert.equal(currentURL(), '/landuse-form/1/edit');
  });

  test('User can add, fill out, save and remove Proposed Site Characteristics subsection', async function (assert) {
    // Create a LU form w public-facilities-related actions
    this.server.create('project', {
      packages: [
        this.server.create('package', 'toDo', {
          dcpPackagetype: 717170001,
          landuseForm: this.server.create('landuse-form', {
            landuseActions: [
              this.server.create('landuse-action', {
                dcpActioncode: 'PS',
              }),
              this.server.create('landuse-action', {
                dcpActioncode: 'PX',
              }),
            ],
          }),
        }),
      ],
    });

    await visit('/landuse-form/1/edit');

    await click('[data-test-add-landuse-geography-button]');

    assert.dom('[data-test-proposed-site-title]').exists();

    // This test doesn't field out the fields in sequential order
    // integer fields
    await fillIn('[data-test-input="dcpCommunityfacilitycommercialnooffirms"]', 123);
    await fillIn('[data-test-input="dcpNumberofdwellingunits"]', 123);
    await fillIn('[data-test-input="dcpBuildingsorsitetotalsquarefootage"]', 123);
    await fillIn('[data-test-input="dcpSquarefootagetobeacquired"]', 123);
    await fillIn('[data-test-input="dcpCommunityfacilitycommercialnoofemployees"]', 123);

    await click('[data-test-radio="dcpIsthesiteimprovedunimprovedorpartlyimp"][data-test-radio-option="Unimproved"]');
    await fillIn('[data-test-input="dcpBorough"]', 'text text');
    await fillIn('[data-test-input="dcpUsesonsite"]', 'text text');
    await fillIn('[data-test-input="dcpLocationsiteinbuilding"]', 'text text');
    await fillIn('[data-test-input="dcpOwnership"]', 'text text');
    await fillIn('[data-test-input="dcpDisplacementorrelocation"]', 'text text');
    await fillIn('[data-test-input="dcpLot"]', 'text text');
    await fillIn('[data-test-input="dcpBlock"]', 'text text');
    await fillIn('[data-test-input="dcpNumberoffloorsinbuilding"]', 'text text');
    await fillIn('[data-test-input="dcpVacantforlessthantwoyears"]', 'text text');

    assert.dom('[data-test-save-button]').hasNoAttribute('disabled');

    saveForm();

    await click('[data-test-remove-landuse-geography-button]');

    saveForm();

    assert.dom('[data-test-proposed-site-title]').doesNotExist();
  });

  test('User can update lead-agency', async function(assert) {
    this.server.create('project', 1, {
      packages: [this.server.create('package', 'toDo', 'landuseForm')],
    });
    this.server.create('account', 1, {
      name: 'first account',
    });
    this.server.create('account', 2, {
      name: 'second account',
    });
    this.server.create('account', 3, {
      name: 'third account',
    });

    await visit('/landuse-form/1/edit');

    // filling out necessary information in order to save
    await click('[data-test-add-applicant-button]');
    await fillIn('[data-test-input="dcpFirstname"]', 'Tess');
    await fillIn('[data-test-input="dcpLastname"]', 'Ter');
    await fillIn('[data-test-input="dcpEmail"]', 'tesster@planning.nyc.gov');

    await selectChoose('[data-test-lead-agency-picker]', 'second account');

    await click('[data-test-save-button]');

    assert.equal(this.server.db.landuseForms.firstObject.chosenLeadAgencyId, 2);

    assert.equal(currentURL(), '/landuse-form/1/edit');
  });

  test('User can fill out Disposition section', async function (assert) {
    // Create a LU form w disposition-related actions
    this.server.create('project', {
      packages: [
        this.server.create('package', 'toDo', {
          dcpPackagetype: 717170001,
          landuseForm: this.server.create('landuse-form', {
            landuseActions: [
              this.server.create('landuse-action', {
                dcpActioncode: 'PP',
              }),
            ],
          }),
        }),
      ],
    });

    await visit('/landuse-form/1/edit');

    assert.dom('[data-test-input="dcpTextcityagency"]').doesNotExist();
    assert.dom('[data-test-input="dcpTowhom"]').doesNotExist();

    await click('[data-test-radio="dcpTypedisposition"][data-test-radio-option="General"]');

    assert.dom('[data-test-input="dcpTextcityagency"]').doesNotExist();
    assert.dom('[data-test-input="dcpTowhom"]').doesNotExist();

    await click('[data-test-radio="dcpTypedisposition"][data-test-radio-option="Direct"]');

    await fillIn('[data-test-input="dcpTextcityagency"]', 'text text');
    await fillIn('[data-test-input="dcpTowhom"]', 'text text');

    assert.dom('[data-test-disposition-dcpRestrictandcondition-helptext]').doesNotExist();

    await click('[data-test-radio="dcpRestrictandcondition"][data-test-radio-option="None (Pursuant to Zoning)"]');

    assert.dom('[data-test-disposition-dcpRestrictandcondition-helptext]').doesNotExist();

    await click('[data-test-radio="dcpRestrictandcondition"][data-test-radio-option="Restricted"]');

    assert.dom('[data-test-disposition-dcpRestrictandcondition-helptext]').exists();
  });

  test('User can add and delete a ZR Section on the landuse form', async function (assert) {
    this.server.create('project', {
      packages: [
        this.server.create('package', 'toDo', {
          dcpPackagetype: 717170001,
          landuseForm: this.server.create('landuse-form', {
            landuseActions: [
              this.server.create('landuse-action', {
                dcpActioncode: 'ZR',
              }),
            ],
          }),
        }),
      ],
    });

    await visit('/landuse-form/1/edit');

    // fill out other necessary fields for saving
    await click('[data-test-add-applicant-button]');
    await fillIn('[data-test-input="dcpFirstname"]', 'Tess');
    await fillIn('[data-test-input="dcpLastname"]', 'Ter');
    await fillIn('[data-test-input="dcpEmail"]', 'tesster@planning.nyc.gov');

    // add and fill out fields for Zoning Text Amendment section
    await click('[data-test-add-zr-section-button]');
    assert.dom('[data-test-zr-section-fieldset="0"]').exists();

    await fillIn('[data-test-input="dcpZrsectionnumber"]', 'our zr section number');
    await fillIn('[data-test-input="dcpZrsectiontitle"]', 'our zr section title');
    await click('[data-test-save-button]');

    assert.equal(this.server.db.affectedZoningResolutions.firstObject.dcpZrsectionnumber, 'our zr section number');
    assert.equal(this.server.db.affectedZoningResolutions.firstObject.dcpZrsectiontitle, 'our zr section title');

    await click('[data-test-remove-zr-section-button]');
    assert.dom('[data-test-zr-section-fieldset="0"]').doesNotExist();

    await click('[data-test-save-button]');

    assert.equal(this.server.db.affectedZoningResolutions.length, 0);
  });

  test('Attachment list text only shows up when one of PC, PQ, PS, or PX actions are present', async function (assert) {
    this.server.create('project', {
      packages: [
        this.server.create('package', 'toDo', {
          dcpPackagetype: 717170001,
          landuseForm: this.server.create('landuse-form', {
            landuseActions: [
              this.server.create('landuse-action', {
                dcpActioncode: 'PP',
              }),
            ],
          }),
        }),
      ],
    });

    this.server.create('project', {
      packages: [
        this.server.create('package', 'toDo', {
          dcpPackagetype: 717170001,
          landuseForm: this.server.create('landuse-form', {
            landuseActions: [
              this.server.create('landuse-action', {
                dcpActioncode: 'PC',
              }),
            ],
          }),
        }),
      ],
    });

    await visit('/landuse-form/1/edit');

    assert.dom('[data-test-landuse-attachment-list]').doesNotExist();

    await visit('/landuse-form/2/edit');

    assert.dom('[data-test-landuse-attachment-list]').exists();
  });

  test('User can add and delete a Zoning Map Change on the landuse form', async function (assert) {
    this.server.create('project', {
      packages: [
        this.server.create('package', 'toDo', {
          dcpPackagetype: 717170001,
          landuseForm: this.server.create('landuse-form', {
            landuseActions: [
              this.server.create('landuse-action', {
                dcpActioncode: 'ZM',
              }),
            ],
          }),
        }),
      ],
    });

    await visit('/landuse-form/1/edit');

    await selectChoose('[data-test-dcpTotalzoningareatoberezoned-dropdown]', '240,000 to 500,000 square feet');

    // add and fill out fields for Zoning Text Amendment section
    await click('[data-test-add-zoning-map-change-button]');
    assert.dom('[data-test-zoning-map-change-fieldset="0"]').exists();

    await fillIn('[data-test-input="dcpZoningsectionmapsnumber"]', exceedMaximum(100, 'String'));
    assert.dom('[data-test-validation-message="dcpZoningsectionmapsnumber"]').exists();

    await fillIn('[data-test-input="dcpZoningsectionmapsnumber"]', 'zoning section num 1234');
    assert.dom('[data-test-validation-message="dcpZoningsectionmapsnumber"]').doesNotExist();

    await selectChoose('[data-test-dcpExistingzoningdistrictvalue-dropdown]', 'R2A');

    await fillIn('[data-test-input="dcpProposedzoningmapvalue"]', exceedMaximum(100, 'String'));
    assert.dom('[data-test-validation-message="dcpProposedzoningmapvalue"]').exists();

    await fillIn('[data-test-input="dcpProposedzoningmapvalue"]', 'some zoning map value');
    assert.dom('[data-test-validation-message="dcpProposedzoningmapvalue"]').doesNotExist();

    await click('[data-test-save-button]');

    assert.equal(this.server.db.landuseForms.firstObject.dcpTotalzoningareatoberezoned, 717170006);
    assert.equal(this.server.db.zoningMapChanges.firstObject.dcpZoningsectionmapsnumber, 'zoning section num 1234');
    assert.equal(this.server.db.zoningMapChanges.firstObject.dcpExistingzoningdistrictvalue, 717170004);
    assert.equal(this.server.db.zoningMapChanges.firstObject.dcpProposedzoningmapvalue, 'some zoning map value');

    await click('[data-test-remove-zoning-map-change-button]');
    assert.dom('[data-test-zr-section-fieldset="0"]').doesNotExist();

    await click('[data-test-save-button]');

    assert.equal(this.server.db.zoningMapChanges.length, 0);
  });
});
