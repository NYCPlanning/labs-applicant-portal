import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | ui/answer-prompt', function (hooks) {
  setupRenderingTest(hooks);

  test('it’s not a grid cell', async function (assert) {
    await render(hbs`<Ui::AnswerPrompt />`);
    assert.dom('.cell.auto.large-padding-right').doesNotExist();
  });

  test('it’s a grid cell', async function (assert) {
    await render(hbs`<Ui::AnswerPrompt @beside={{true}} />`);
    assert.dom('.cell.auto.large-padding-right').exists();
  });
});
