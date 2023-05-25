import { module, test } from 'qunit';
import {
  click,
  currentRouteName,
  currentURL,
  find,
  focus,
  visit,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import window, { setupWindowMock } from 'ember-window-mock';
import { setupMirage } from 'ember-cli-mirage/test-support';
import {
  currentSession,
  authenticateSession,
} from 'ember-simple-auth/test-support';
import { Response } from 'ember-cli-mirage';

const DUMMY_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

module('Acceptance | user can login', function (hooks) {
  setupApplicationTest(hooks);
  setupWindowMock(hooks);
  setupMirage(hooks);

  test('AccessToken is sent to server', async function (assert) {
    assert.expect(2);

    this.server.create('contact');
    this.server.get('/login', (schema, request) => {
      assert.equal(request.queryParams.accessToken, DUMMY_TOKEN);
    });

    window.location.hash = `#access_token=${DUMMY_TOKEN}`;
    await visit('/login');

    assert.equal(currentSession().isAuthenticated, true);
  });

  test('User can logout', async function (assert) {
    assert.expect(2);

    this.server.create('contact');

    window.location.hash = `#access_token=${DUMMY_TOKEN}`;
    await visit('/login');
    await focus('[data-test-auth="menu-button"]');
    await click('[data-test-auth="logout"]');

    assert.equal(currentURL(), '/logout?header=true');
    assert.equal(currentSession().isAuthenticated, false);
  });

  test('User sees error message if no CRM contact is found for their email', async function (assert) {
    const accessToken = DUMMY_TOKEN;
    this.server.create('contact');
    this.server.get(
      '/login',
      () => new Response(
        401,
        { some: 'header' },
        {
          errors: [
            {
              code: 'NO_CONTACT_FOUND',
              title:
                  'This message is nice but does not affect frontend logic',
              status: 401,
            },
          ],
        },
      ),
    );

    window.location.hash = `#access_token=${accessToken}`;
    await visit('/login');

    assert.ok(
      find('[data-test-applicant-error-message="contact-not-assigned"]'),
    );
    assert
      .dom('[data-test-error-key="code"]')
      .hasText('code: NO_CONTACT_FOUND', 'It displays the correct error code');
  });

  test('If user already logged in, revisiting index reroutes them to projects page', async function (assert) {
    // user logs in
    this.server.create('contact');
    this.server.get('/login', (schema, request) => {
      assert.equal(request.queryParams.accessToken, DUMMY_TOKEN);
    });
    window.location.hash = `#access_token=${DUMMY_TOKEN}`;
    await visit('/login');

    // because user is already logged in, route should redirect to /projects
    await visit('/');
    assert.equal(currentURL(), '/projects');

    // user logs out
    await focus('[data-test-auth="menu-button"]');
    await click('[data-test-auth="logout"]');

    // because user is logged out, route should not redirect
    await visit('/');
    assert.equal(currentURL(), '/');
  });

  test('User sees error message if no access token present', async function (assert) {
    this.server.create('contact');

    await visit('/login');

    assert
      .dom('[data-test-error-key="detail"][data-test-error-idx="0"]')
      .hasText('detail: Invalid auth params - "access_token" missing.');
  });

  test('User is sent to validation instructions if their account is invalid', async function (assert) {
    this.server.create('contact', {
      isNycidValidated: false,
      isNycidEmailRegistered: true,
    });

    window.location.hash = `#access_token=${DUMMY_TOKEN}`;
    try {
      await visit('/login');
    } catch (e) {
      // the promise rejects because the route intentionally aborts the transition if the email isn't validated.
    }

    assert.equal(currentRouteName(), 'auth.validate');
  });

  test('Redirect an unauthenticated user', async function (assert) {
    this.server.get(
      '/projects',
      () => new Response(
        403,
        { some: 'header' },
        {
          errors: [
            {
              status: 403,
            },
          ],
        },
      ),
    );

    await authenticateSession();
    await visit('/projects');

    assert.equal(currentRouteName(), 'index');
  });
});
