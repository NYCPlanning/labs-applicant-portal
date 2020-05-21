import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | packages/pas-form/show', function(hooks) {
  setupRenderingTest(hooks);

  test('it creates a proposedDevelopmentTypes array', async function(assert) {
    // Set some types as true and some as false
    this.set('package', {
      pasForm: {
        dcpProposeddevelopmentsitenewconstruction: true,
        dcpProposeddevelopmentsitedemolition: true,
        dcpProposeddevelopmentsiteinfoalteration: false,
        dcpProposeddevelopmentsiteinfoaddition: false,
      },
    });

    await render(hbs`<Packages::PasForm::Show @package={{this.package}} />`);

    // Make sure the true types render
    assert.dom('[data-test-show="dcpProposeddevelopmentsitenewconstruction"]').exists();
    assert.dom('[data-test-show="dcpProposeddevelopmentsitedemolition"]').exists();

    // Make sure the false types do not render
    assert.dom('[data-test-show="dcpProposeddevelopmentsiteinfoalteration"]').doesNotExist();
    assert.dom('[data-test-show="dcpProposeddevelopmentsiteinfoaddition"]').doesNotExist();
  });
});
