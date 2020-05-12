import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | packages/edit', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let controller = this.owner.lookup('controller:packages/edit');
    assert.ok(controller);
  });
});
