import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Modifier | animate-with', function(hooks) {
  setupRenderingTest(hooks);

  // Replace this with your real tests.
  test('it renders', async function(assert) {
    await render(hbs`
      <div data-test="animated" {{animate-with 'initial-class' 'secondary'}}></div>
    `);

    assert.dom('[data-test="animated"]').matchesSelector('.initial-class');
  });
});
