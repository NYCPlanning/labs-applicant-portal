import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Unit | Model | package', function(hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  // Replace this with your real tests.
  test('it exists', async function(assert) {
    const store = this.owner.lookup('service:store');
    const bbl = store.createRecord('bbl');
    const ourProject = store.createRecord('project');
    const model = store.createRecord('package', {
      project: ourProject,
      pasForm: store.createRecord('pas-form', {
        bbls: [bbl],
        applicants: [store.createRecord('applicant')],
      }),
    });

    bbl.dcpDevelopmentsite = true;

    await model.save();

    assert.ok(model);
  });
});
