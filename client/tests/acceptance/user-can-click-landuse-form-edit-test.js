import { module, test } from 'qunit';
import {
  visit,
  click,
  currentURL,
  settled,
  fillIn,
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
});
