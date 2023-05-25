import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | saveable-form/validator', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    this.dummyModel = {};
    this.validator = {};

    // Template block usage:
    await render(hbs`
      <SaveableForm::Validator
        @model={{this.dummyModel}}
        @validator={{this.validator}} as |myValidator|
      >
        {{myValidator.isValid}}, {{myValidator.isDirty}}
      </SaveableForm::Validator>
    `);

    assert.dom().hasText('true, false');
  });
});
