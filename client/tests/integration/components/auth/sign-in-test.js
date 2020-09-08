import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';

module('Integration | Component | auth/sign-in', function(hooks) {
  setupRenderingTest(hooks);

  test('it routes', async function(assert) {
    assert.expect(4);

    class FakeRouter extends Service {
      transitionTo() { assert.ok(true); }
    }

    this.owner.register('service:router', FakeRouter);

    this.set('searchContacts', () => ({
      isNycidValidated: true,
      isNycidEmailRegistered: true,
      isCityEmployee: true,
    }));

    await render(hbs`
      <Auth::SignIn
        @searchContacts={{this.searchContacts}}
      />
    `);

    await click('[data-test-sign-in="next"]');

    this.set('searchContacts', () => ({
      isNycidValidated: null,
      isNycidEmailRegistered: true,
      isCityEmployee: true,
    }));

    await click('[data-test-sign-in="next"]');

    this.set('searchContacts', () => ({
      isNycidValidated: null,
      isNycidEmailRegistered: false,
      isCityEmployee: true,
    }));

    await click('[data-test-sign-in="next"]');

    this.set('searchContacts', () => ({
      isNycidValidated: false,
      isNycidEmailRegistered: true,
      isCityEmployee: true,
    }));

    await click('[data-test-sign-in="next"]');
  });
});
