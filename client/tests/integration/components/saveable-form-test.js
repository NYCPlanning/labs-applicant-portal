import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn, click } from '@ember/test-helpers';
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

  test('it mutates, validates, saves, submits', async function (assert) {
    this.dummyModel = {
      someProp: 'test',
      someBool: null,
    };

    this.handleSave = async () => {
      assert.ok(true);
    };

    this.handleSubmit = async () => {
      assert.ok(true);
    };

    await render(hbs`
      <SaveableForm
        @model={{this.dummyModel}}
        as |saveable-form|
      >
        <Input
          @type="text"
          @value={{saveable-form.saveableChanges.someProp}}
        />

        <span data-test-radio-button-1>
          <saveable-form.radio
            @value={{true}}
            @groupValue={{saveable-form.saveableChanges.someBool}}
          />
        </span>

        <saveable-form.radio
          @value={{false}}
          @groupValue={{saveable-form.saveableChanges.someBool}}
        />

        <saveable-form.saveButton
          @onClick={{this.handleSave}}
          data-test-save-button
        />
        <saveable-form.submitButton
          @onClick={{this.handleSubmit}}
          data-test-submit-button
        />
      </SaveableForm>
    `);

    await fillIn('input', 'asdf');
    await click('[data-test-radio-button-1] input');
    await click('[data-test-save-button]');
    await click('[data-test-submit-button]');

    assert.deepEqual(this.dummyModel, {
      someProp: 'asdf',
      someBool: true,
    });

    assert.expect(3);
  });

  test('it errors', async function (assert) {
    this.dummyModel = {
      someProp: 'test',
      someBool: null,
    };

    this.handleSave = async () => {
      throw new Error('something bad happened');
    };

    await render(hbs`
      <SaveableForm
        @model={{this.dummyModel}}
        as |saveable-form|
      >
        <saveable-form.saveButton
          @onClick={{this.handleSave}}
          data-test-save-button
        />
      </SaveableForm>
    `);


    await click('[data-test-save-button]');

    assert.ok(true);
  });
});
