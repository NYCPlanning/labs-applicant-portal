import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { focus, render, waitFor } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | user-badge', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders with a menu button and popover', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<Auth::UserBadge />`);
    await focus('[data-test-auth="menu-button"]');
    await waitFor('[data-test-auth="logout"]');

    assert.dom('[data-test-auth="logout"]').exists();
  });
});
