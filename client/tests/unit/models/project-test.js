import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | project', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
    const store = this.owner.lookup('service:store');
    const model = store.createRecord('project', {});

    assert.equal(model.packages.length, 0);

    assert.ok(model);
  });

  test('pasPackages works when no packages available', function (assert) {
    const store = this.owner.lookup('service:store');
    const model = store.createRecord('project', {
      packages: [],
    });

    assert.equal(model.pasPackages.length, 0);

    assert.ok(model);
  });

  test('rwcdsPackages works when no packages available', function (assert) {
    const store = this.owner.lookup('service:store');
    const model = store.createRecord('project', {
      packages: [],
    });

    assert.equal(model.rwcdsPackages.length, 0);

    assert.ok(model);
  });
});
