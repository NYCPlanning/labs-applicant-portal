import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | ui/confirmation-modal', function(hooks) {
  setupRenderingTest(hooks);

  test.skip('it renders', async function(assert) {
    this.show = false;
    this.toggle = () => { this.set('show', !this.show); };

    // Template block usage:
    await render(hbs`
      <div id="reveal-modal-container">
      </div>

      <Ui::ConfirmationModal
        @show={{this.show}}
        @toggle={{this.toggle}}
        @continueButtonTitle="Continue Editing"
      >
        template block text
      </Ui::ConfirmationModal>
    `);

    assert.dom().doesNotContainText('template block text');

    await this.toggle();

    assert.dom().containsText('template block text');

    await click('[data-test-opaque-overlay]');

    assert.dom().doesNotContainText('template block text');

    await this.toggle();

    await click('[data-test-continue-button]');

    assert.dom().doesNotContainText('template block text');

    await this.toggle();

    await click('[data-test-close-button]');

    assert.dom().doesNotContainText('template block text');
  });
});
