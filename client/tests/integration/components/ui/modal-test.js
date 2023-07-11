import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | ui/modal', function(hooks) {
  setupRenderingTest(hooks);

  test.skip('it opens', async function(assert) {
    this.open = false;

    // Template block usage:
    await render(hbs`
      <div id="reveal-modal-container">
      </div>

      <Ui::Modal
        @open={{this.open}}
        @container="reveal-modal-container"
      >
        template block text
      </Ui::Modal>
    `);

    assert.dom().doesNotContainText('template block text');

    await this.set('open', true);

    assert.dom().containsText('template block text');
  });
});
