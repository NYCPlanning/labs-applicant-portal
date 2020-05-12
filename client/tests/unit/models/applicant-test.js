import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | applicant', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    const store = this.owner.lookup('service:store');
    const model = store.createRecord('applicant', {});

    // make sure code cov tests the computed friendlyEntityName conditional
    model.targetEntity = 'invalid';

    assert.ok(model);
  });
});
