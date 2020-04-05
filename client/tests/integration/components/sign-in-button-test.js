import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import window from 'ember-window-mock';
import ENV from '../../../config/environment';

module('Integration | Component | sign-in-button', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<SignInButton />`);
    await click('[data-test-login="do-login"]');

    assert.ok(window.location.href.includes(ENV.NYCIDLocation));
  });
});
