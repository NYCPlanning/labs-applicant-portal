import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | saveable-form', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    this.dummyModel = {};

    await render(hbs`
      <SaveableForm
        @model={{this.dummyModel}}
      />
    `);

    assert.equal(this.element.textContent.trim(), '');

    await render(hbs`
      <SaveableForm
        @model={{this.dummyModel}}
      >
        template block text
      </SaveableForm>
    `);

    assert.equal(this.element.textContent.trim(), 'template block text');
  });
});
