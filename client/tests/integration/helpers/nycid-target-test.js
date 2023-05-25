import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Helper | nycid-target', function (hooks) {
  setupRenderingTest(hooks);

  // Replace this with your real tests.
  test('it generates nycid "target" param, encoded', async function (assert) {
    this.set('inputValue', '1234');

    await render(hbs`{{nycid-target inputValue}}`);

    assert.equal(this.element.textContent.trim(), btoa('1234'));
  });
});
