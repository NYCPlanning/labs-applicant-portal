import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | date-display', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders date in specified format', async function(assert) {
    await render(hbs`<Ui::DateDisplay
      @date='11/1/2013'
      @outputFormat='MM/DD/YY'
      @inputFormat='D/MM/YYYY'
    />`);

    assert.equal(this.element.textContent.trim(), '01/11/13');
  });

  test('it displays error message if blank date passed', async function(assert) {
    await render(hbs`<Ui::DateDisplay
      @date=''
      @outputFormat='MM/DD/YY'
      @inputFormat='D/MM/YYYY'
      @errorMessage="whoops"
    />`);

    assert.equal(this.element.textContent.trim(), 'whoops');
  });
});
