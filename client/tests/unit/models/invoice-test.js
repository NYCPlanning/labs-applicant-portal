import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | invoice', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('invoice', {});
    assert.ok(model);
  });
});
