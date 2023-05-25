import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | ui/answer', function (hooks) {
  setupRenderingTest(hooks);

  test('it’s not a grid cell', async function (assert) {
    await render(hbs`<Ui::Answer />`);
    assert.dom('.grid-x').doesNotExist();
  });

  test('it’s a grid cell', async function (assert) {
    await render(hbs`<Ui::Answer @beside={{true}} />`);
    assert.dom('.grid-x').exists();
  });
});
