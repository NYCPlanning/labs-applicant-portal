import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | validation-message', function(hooks) {
  setupRenderingTest(hooks);

  test('it displays a deeply nested error message', async function(assert) {
    this.changeset = {
      error: {
        dcpSomeField: {
          validation: 'Something went wrong',
        },
      },
    };

    await render(hbs`
      <ValidationMessage
        @field='dcpSomeField'
        @changeset={{this.changeset}}
      />
    `);

    assert.dom().hasText('Something went wrong');
  });
});
