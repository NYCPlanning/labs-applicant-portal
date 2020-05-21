import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Helper | optionset', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    this.set('inputValue', '1234');

    await render(hbs`{{optionset 'applicant' 'state' 'label' 'OR'}}`);

    assert.equal(this.element.textContent.trim(), 'OR');
  });
});
