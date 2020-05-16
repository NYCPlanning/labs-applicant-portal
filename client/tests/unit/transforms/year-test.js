import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Transform | year', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it serializes to a year', function(assert) {
    const transform = this.owner.lookup('transform:year');

    assert.equal(transform.serialize(2049), `${new Date(2049, 0)}`);
  });

  test('it deserializes to a year', function (assert) {
    const transform = this.owner.lookup('transform:year');

    assert.equal(transform.deserialize(new Date(2049, 0)), 2049);
  });
});
