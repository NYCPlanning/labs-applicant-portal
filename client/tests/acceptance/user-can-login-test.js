import { module, test } from 'qunit';
import {
  visit, click, currentURL, find,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import window, { setupWindowMock } from 'ember-window-mock';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { currentSession } from 'ember-simple-auth/test-support';
import { Response } from 'ember-cli-mirage';

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

  test('User sees error message if no CRM contact is found for their email', async function (assert) {
    const accessToken = 'a-valid-jwt';
    this.server.create('user');
    this.server.get('/login', () => new Response(401, { some: 'header' }, {
      errors: [{
        response: {
          code: 'NO_CONTACT_FOUND',
          message: 'This message is nice but does not affect frontend logic',
        },
        status: 401,
      }],
    }));

    window.location.hash = `#access_token=${accessToken}`;
    await visit('/login');

    assert.ok(find('[data-test-applicant-error-message="contact-not-assigned"'));
    assert.equal(find('[data-test-error-response="code0"]').textContent.trim(), 'code: NO_CONTACT_FOUND');
  });

  test('If user already logged in, revisiting index reroutes them to projects page', async function (assert) {
    // user logs in
    this.server.create('user');
    this.server.get('/login', (schema, request) => {
      assert.equal(request.queryParams.accessToken, 'a-valid-jwt');
    });
    window.location.hash = '#access_token=a-valid-jwt';
    await visit('/login');

    // because user is already logged in, route should redirect to /projects
    await visit('/');
    assert.equal(currentURL(), '/projects');

    // user logs out
    await click('[data-test-auth="logout"');

    // because user is logged out, route should not redirect
    await visit('/');
    assert.equal(currentURL(), '/');
  });
});
