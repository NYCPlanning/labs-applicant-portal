import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, waitFor } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | auth/do-logout', function(hooks) {
  setupRenderingTest(hooks);

  test.skip('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<Auth::DoLogout />`);
    await waitFor('[data-iframe-did-load="true"]');

    assert.equal(this.element.textContent.trim(), '');
  });
});
