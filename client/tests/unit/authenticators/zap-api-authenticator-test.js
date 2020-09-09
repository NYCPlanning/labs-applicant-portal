import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Unit | Authenticators | zap-api-authenticator', function (hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  test('it exists', function (assert) {
    const authenticator = this.owner.lookup('authenticator:zap-api-authenticator');

    assert.ok(authenticator);
  });
});
