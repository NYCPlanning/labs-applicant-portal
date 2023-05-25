import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | ui/collapsible-text', function (hooks) {
  setupRenderingTest(hooks);

  test('clicking on additional text link renders correct text', async function (assert) {
    await render(hbs`
      <Ui::CollapsibleText @buttonText="My Additional Text Title">
        Here is my additional text.
      </Ui::CollapsibleText>
    `);

    assert
      .dom('[data-test-title="My Additional Text Title"]')
      .hasText('My Additional Text Title');
    assert.dom('[data-test-additional-text]').doesNotExist();

    await click('[data-test-title="My Additional Text Title"]');

    assert
      .dom('[data-test-title="My Additional Text Title"]')
      .hasText('My Additional Text Title');
    assert
      .dom('[data-test-additional-text]')
      .hasText('Here is my additional text.');
  });
});
