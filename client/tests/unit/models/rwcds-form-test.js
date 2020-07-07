import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | rwcds-form', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    const store = this.owner.lookup('service:store');
    const model = store.createRecord('rwcds-form', {});
    assert.ok(model);
  });
});
