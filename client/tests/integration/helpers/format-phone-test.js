import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Helper | format-phone', function (hooks) {
  setupRenderingTest(hooks);

  // Replace this with your real tests.
  test('it renders', async function (assert) {
    this.set('inputValue', '7188675309');

    await render(hbs`{{format-phone inputValue}}`);

    assert.equal(this.element.textContent.trim(), '(718) 867-5309');
  });
});
