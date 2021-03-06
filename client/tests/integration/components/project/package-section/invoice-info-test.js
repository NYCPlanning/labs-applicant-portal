import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | project/package-section/invoice-info', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`
      <Project::PackageSection::InvoiceInfo
        @invoice={{hash dcpInvoicedate=1603810916000}}
      />
    `);

    assert.equal(this.element.textContent.trim(), '2020-10-27');
  });
});
