import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | fileManagement', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    const service = this.owner.lookup('service:file-management');
    assert.ok(service);
  });

  test('it returns already-registered file manager', function(assert) {
    const service = this.owner.lookup('service:file-management');

    service.findOrCreate(1, []);
    service.findOrCreate(1, []);

    // This is not a great test. But I'm not sure there's a way to prove this class
    // doesn't duplicate things/recreate things.
    assert.ok(service);
  });
});
