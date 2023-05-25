import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | ui/answer-field', function (hooks) {
  setupRenderingTest(hooks);

  test('it’s not a grid cell', async function (assert) {
    await render(hbs`<Ui::AnswerField />`);
    assert.dom('.cell.large-3').doesNotExist();
  });

  test('it’s a grid cell', async function (assert) {
    await render(hbs`<Ui::AnswerField @beside={{true}} />`);
    assert.dom('.cell.large-3').exists();
  });
});
