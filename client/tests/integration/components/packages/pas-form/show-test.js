import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | packages/pas-form/show', function(hooks) {
  setupRenderingTest(hooks);

  test('All types get rendered from proposedDevelopmentTypes array', async function(assert) {
    this.set('packageHasAllTypes', {
      pasForm: {
        dcpProposeddevelopmentsitenewconstruction: true,
        dcpProposeddevelopmentsitedemolition: true,
        dcpProposeddevelopmentsiteinfoalteration: true,
        dcpProposeddevelopmentsiteinfoaddition: true,
        dcpProposeddevelopmentsitechnageofuse: true,
        dcpProposeddevelopmentsiteenlargement: true,
        dcpProposeddevelopmentsiteinfoother: true,
      },
    });

    await render(hbs`<Packages::PasForm::Show @package={{this.packageHasAllTypes}} />`);

    assert.dom('[data-test-show="dcpProposeddevelopmentsitenewconstruction"]').exists();
    assert.dom('[data-test-show="dcpProposeddevelopmentsitedemolition"]').exists();
    assert.dom('[data-test-show="dcpProposeddevelopmentsiteinfoalteration"]').exists();
    assert.dom('[data-test-show="dcpProposeddevelopmentsiteinfoaddition"]').exists();
    assert.dom('[data-test-show="dcpProposeddevelopmentsitechnageofuse"]').exists();
    assert.dom('[data-test-show="dcpProposeddevelopmentsiteenlargement"]').exists();
    assert.dom('[data-test-show="dcpProposeddevelopmentsiteinfoother"]').exists();
  });

  test('Falsy types do not get rendered from proposedDevelopmentTypes array', async function(assert) {
    this.set('packageHasSomeTypes', {
      pasForm: {
        dcpProposeddevelopmentsitenewconstruction: true,
        dcpProposeddevelopmentsitedemolition: true,
        dcpProposeddevelopmentsiteinfoalteration: true,
        dcpProposeddevelopmentsiteinfoaddition: false,
      },
    });

    await render(hbs`<Packages::PasForm::Show @package={{this.packageHasSomeTypes}} />`);

    assert.dom('[data-test-show="dcpProposeddevelopmentsitenewconstruction"]').exists();
    assert.dom('[data-test-show="dcpProposeddevelopmentsitedemolition"]').exists();
    assert.dom('[data-test-show="dcpProposeddevelopmentsiteinfoalteration"]').exists();
    assert.dom('[data-test-show="dcpProposeddevelopmentsiteinfoaddition"]').doesNotExist();
    assert.dom('[data-test-show="dcpProposeddevelopmentsitechnageofuse"]').doesNotExist();
    assert.dom('[data-test-show="dcpProposeddevelopmentsiteenlargement"]').doesNotExist();
    assert.dom('[data-test-show="dcpProposeddevelopmentsiteinfoother"]').doesNotExist();
  });
});
