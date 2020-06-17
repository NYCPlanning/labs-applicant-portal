import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | form-validator', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    this.dummyModel = {};
    this.validator = {};

    // Template block usage:
    await render(hbs`
      <FormValidator
        @model={{this.dummyModel}}
        @validator={{this.validator}} as |myValidator|
      >
        {{myValidator.isValid}}, {{myValidator.isDirty}}
      </FormValidator>
    `);

    assert.dom().hasText('true, false');
  });
});
