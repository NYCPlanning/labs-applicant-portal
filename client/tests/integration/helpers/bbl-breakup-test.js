import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Helper | bbl-breakup', function(hooks) {
  setupRenderingTest(hooks);

  // Replace this with your real tests.
  test('correctly breaks up bbl', async function(assert) {
    await render(hbs`{{bbl-breakup "1234567890"}}`);

    assert.equal(this.element.textContent.trim(), 'Borough 1, Block 23456, Lot 7890');
  });
});
