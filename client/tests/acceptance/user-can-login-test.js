import { module, test } from 'qunit';
import { visit, click, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import window, { setupWindowMock } from 'ember-window-mock';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { authenticateSession, currentSession } from 'ember-simple-auth/test-support';

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

  test('User can logout', async function (assert) {
    this.server.createList('project', 10);

    await authenticateSession();

    await visit('/projects');
    await click('[data-test-auth="logout"]');

    assert.equal(currentURL(), '/logout');
    assert.equal(currentSession().isAuthenticated, false);
  });
});
