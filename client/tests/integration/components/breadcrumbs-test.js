import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | breadcrumbs', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders a list in a nav', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<Breadcrumbs />`);

    assert.dom('nav[data-test-breadcrumb-nav]').exists();
    assert.dom('ul[data-test-breadcrumb-list]').exists();
  });
});
