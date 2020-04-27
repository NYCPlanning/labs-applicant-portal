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

  test('it restores', async function (assert) {
    const authenticator = this.owner.lookup('authenticator:zap-api-authenticator');
    const store = this.owner.lookup('service:store');

    const contact = this.server.create('contact', {
      emailaddress1: 'contact@email.com',
    });
    this.server.get('/login', (schema, request) => {
      assert.equal(request.queryParams.accessToken, 'a-valid-jwt');
    });

    await authenticator.restore();

    assert.equal(
      store.peekRecord('contact', contact.id).emailaddress1,
      'contact@email.com',
    );
  });
});
