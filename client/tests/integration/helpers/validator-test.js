import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Helper | validator', function(hooks) {
  setupRenderingTest(hooks);

  // Replace this with your real tests.
  test('it re-renders, idempotently', async function(assert) {
    this.inputValue = {
      foo: 'bar',
    };

    await render(hbs`
      {{#let (validator inputValue) as |changeset|}}
        {{changeset.foo}}
      {{/let}}
    `);

    assert.dom().hasText('bar');

    this.set('inputValue.foo', 'baz');

    assert.dom().hasText('baz');
  });
});
