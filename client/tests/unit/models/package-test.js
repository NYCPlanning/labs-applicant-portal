import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Unit | Model | package', function(hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  test('it exists and can save', async function(assert) {
    const store = this.owner.lookup('service:store');
    const bbl = store.createRecord('bbl');
    const model = await store.createRecord('package', {
      statuscode: 'Package Preparation',
      dcpVisibility: 717170003,
      pasForm: store.createRecord('pas-form', {
        bbls: [bbl],
        applicants: [store.createRecord('applicant')],
      }),
    });

    bbl.dcpDevelopmentsite = true;

    await model.saveDescendants();

    assert.ok(model);
  });

  test('No file manager is created for non-applicant packages', async function(assert) {
    const store = this.owner.lookup('service:store');
    const bbl = store.createRecord('bbl');
    const model = await store.createRecord('package', {
      statuscode: 'Certified',
      dcpVisibility: 717170003,
      pasForm: store.createRecord('pas-form', {
        bbls: [bbl],
        applicants: [store.createRecord('applicant')],
      }),
    });

    assert.notOk(model.fileManager);
  });
});
