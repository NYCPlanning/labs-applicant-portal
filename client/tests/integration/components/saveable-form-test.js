import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | saveable-form', function(hooks) {
  setupRenderingTest(hooks);

  // default some blank validators
  hooks.beforeEach(function() {
    this.set('validators', [{}, {}]);
  });

  test('it renders', async function(assert) {
    this.dummyModel = {};

    await render(hbs`
      <SaveableForm
        @model={{this.dummyModel}}
        @validators={{this.validators}}
      />
    `);

    assert.equal(this.element.textContent.trim(), '');

    await render(hbs`
      <SaveableForm
        @model={{this.dummyModel}}
        @validators={{this.validators}}
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
        @validators={{this.validators}}
        as |saveable-form|
      >
        <Input
          @type="text"
          @value={{saveable-form.saveableChanges.someProp}}
        />

        <span data-test-radio-button-1>
          <saveable-form.Radio
            @value={{true}}
            @groupValue={{saveable-form.saveableChanges.someBool}}
          />
        </span>

        <saveable-form.Radio
          @value={{false}}
          @groupValue={{saveable-form.saveableChanges.someBool}}
        />

        <saveable-form.SaveButton
          @onClick={{this.handleSave}}
          data-test-save-button
        />
        <saveable-form.SubmitButton
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
        @validators={{this.validators}}
        as |saveable-form|
      >
        <saveable-form.SaveButton
          @onClick={{this.handleSave}}
          data-test-save-button
        />
      </SaveableForm>
    `);

    await click('[data-test-save-button]');

    assert.ok(true);
  });

  test('it yields validatable child forms, validates', async function (assert) {
    this.dummyModel = {
      someProp: 'test',
      someBool: null,
    };

    this.secondaryModel = {
      someProp: 'test',
      someBool: null,
    };

    this.handleSave = async () => {};

    await render(hbs`
      <SaveableForm
        @model={{this.dummyModel}}
        @validators={{this.validators}}
        as |saveable-form|
      >
        <saveable-form.SaveableForm
          @model={{this.secondaryModel}}
          @validators={{this.validators}}
          as |saveable-child-form|
        >
          <Input
            @type="text"
            @value={{saveable-child-form.saveableChanges.someProp}}
          />
        </saveable-form.SaveableForm>

        <saveable-form.SaveButton
          @onClick={{this.handleSave}}
          data-test-save-button
        />
        <saveable-form.SubmitButton
          @onClick={{this.handleSubmit}}
          data-test-submit-button
        />
      </SaveableForm>
    `);

    assert.dom('[data-test-save-button]').isDisabled();

    await fillIn('input', 'asdf');

    assert.dom('[data-test-save-button]').isEnabled();

    assert.deepEqual(this.secondaryModel, {
      someProp: 'test',
      someBool: null,
    }, 'does not mutate until saved');

    await click('[data-test-save-button]');

    assert.deepEqual(this.secondaryModel, {
      someProp: 'asdf',
      someBool: null,
    }, 'mutates when saved');
  });
});
