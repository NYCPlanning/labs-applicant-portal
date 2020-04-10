import { module, test } from 'qunit';
import { visit, click, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import window, { setupWindowMock } from 'ember-window-mock';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { currentSession } from 'ember-simple-auth/test-support';

module('Acceptance | user can login', function(hooks) {
  setupApplicationTest(hooks);
  setupWindowMock(hooks);
  setupMirage(hooks);

  test('AccessToken is sent to server', async function(assert) {
    assert.expect(2);

    this.server.create('user');
    this.server.get('/login', (schema, request) => {
      assert.equal(request.queryParams.accessToken, 'a-valid-jwt');
    });

    window.location.hash = '#access_token=a-valid-jwt';
    await visit('/login');

    assert.equal(currentSession().isAuthenticated, true);
  });

  test('User can logout', async function (assert) {
    assert.expect(3);

    this.server.create('user');
    this.server.get('/logout', () => assert.ok(true));

    window.location.hash = '#access_token=a-valid-jwt';
    await visit('/login');
    await click('[data-test-auth="logout"]');

    assert.equal(currentURL(), '/logout');
    assert.equal(currentSession().isAuthenticated, false);
  });
});
