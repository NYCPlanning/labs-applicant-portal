import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Helper | in-array', function (hooks) {
  setupRenderingTest(hooks);

  test('check that item is in array', async function (assert) {
    this.inputValue = 'B';
    this.ourArray = ['A', 'B', 'C'];

    await render(hbs`{{in-array this.ourArray this.inputValue}}`);

    assert.equal(this.element.textContent.trim(), 'true');
  });
});
