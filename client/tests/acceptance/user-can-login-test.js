import { module, test } from 'qunit';
import { visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import window, { setupWindowMock } from 'ember-window-mock';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | user can login', function(hooks) {
  setupApplicationTest(hooks);
  setupWindowMock(hooks);
  setupMirage(hooks);

  test('AccessToken is sent to server', async function(assert) {
    assert.expect(1);

    this.server.create('user');
    this.server.get('/login', (schema, request) => {
      assert.equal(request.queryParams.accessToken, 'a-valid-jwt');
    });

    window.location.hash = '#access_token=a-valid-jwt';
    await visit('/login');
  });
});
