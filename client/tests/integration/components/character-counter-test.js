import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | character-counter', function(hooks) {
  setupRenderingTest(hooks);

  test('Character counter always displays', async function(assert) {
    await render(hbs`
      <CharacterCounter
        @string="abcd"
        @maxlength="20"
      />
    `);

    assert.dom('[data-character-counter]').exists();
  });

  test('Character counter displays as invalid when over maxlength', async function(assert) {
    await render(hbs`
      <CharacterCounter
        @string="abcdefghijklmnopqrstuvwxyz"
        @maxlength="20"
      />
    `);

    assert.dom('[data-character-counter].invalid').exists();
  });

  test('Character counter displays as warning when over 80% of maxlength', async function(assert) {
    await render(hbs`
      <CharacterCounter
        @string="abcdefghijklmnopqr"
        @maxlength="20"
      />
    `);

    assert.dom('[data-character-counter].warning').exists();
  });
});
