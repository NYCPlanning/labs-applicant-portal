import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Helper | get-env-variable', function (hooks) {
  setupRenderingTest(hooks);

  // Replace this with your real tests.
  test('it renders', async function (assert) {
    this.set('inputValue', 'key');
    this.environment = { key: 'value' };

    await render(hbs`{{get-env-variable inputValue environment=environment}}`);

    assert.equal(this.element.textContent.trim(), 'value');
  });
});
