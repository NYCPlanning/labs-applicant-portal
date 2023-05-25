import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module(
  'Integration | Helper | square-footage-to-subtotal-lookup',
  function (hooks) {
    setupRenderingTest(hooks);

    test('it renders', async function (assert) {
      this.set('inputValue', 717170001);

      await render(hbs`{{square-footage-to-subtotal inputValue}}`);

      assert.equal(this.element.textContent.trim(), 460);
    });
  },
);
