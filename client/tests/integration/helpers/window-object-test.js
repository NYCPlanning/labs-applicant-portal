import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import window from 'ember-window-mock';

module('Integration | Helper | window-object', function(hooks) {
  setupRenderingTest(hooks);

  // Replace this with your real tests.
  test('it renders', async function(assert) {
    window.location.href = 'lol.com';

    await render(hbs`{{window-object 'location' 'href'}}`);

    assert.ok(this.element.textContent.includes('lol.com'));
  });
});
