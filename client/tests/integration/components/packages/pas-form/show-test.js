import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | packages/pas-form/show', function(hooks) {
  setupRenderingTest(hooks);

  test('Displays Project Addresses', async function(assert) {
    this.set('packagePasForm', {
      pasForm: {
        projectAddresses: [
          {
            dcpConcatenatedaddressvalidated: '77 Frederick Douglas',
          },
          {
            dcpConcatenatedaddressvalidated: '3 Adam Clayton Powell Jr.',
          },
        ],
      },
    });

    await render(hbs`<Packages::PasForm::Show @package={{this.packagePasForm}} />`);

    assert.dom('[data-test-projectAddress="0"]').hasText('77 Frederick Douglas');
  });

  test('Displays all proposed development types', async function(assert) {
    this.set('packageHasAllTypes', {
      pasForm: {
        dcpProposeddevelopmentsitenewconstruction: true,
        dcpProposeddevelopmentsitedemolition: true,
        dcpProposeddevelopmentsiteinfoalteration: true,
        dcpProposeddevelopmentsiteinfoaddition: true,
        dcpProposeddevelopmentsitechnageofuse: true,
        dcpProposeddevelopmentsiteenlargement: true,
        dcpProposeddevelopmentsiteinfoother: true,
        dcpProposeddevelopmentsiteotherexplanation: 'Esta bien',
      },
    });

    await render(hbs`<Packages::PasForm::Show @package={{this.packageHasAllTypes}} />`);

    assert.dom('[data-test-proposedDevelopmentTypes]').hasText('Newly constructed buildings, Demolition, Alteration, Addition, Change of use, Enlargement, Other (Esta bien)');
  });

  test('Does not display Falsy proposed development types', async function(assert) {
    this.set('packageHasSomeTypes', {
      pasForm: {
        dcpProposeddevelopmentsitenewconstruction: true,
        dcpProposeddevelopmentsitedemolition: true,
        dcpProposeddevelopmentsiteinfoalteration: true,
        dcpProposeddevelopmentsiteinfoaddition: false,
      },
    });

    await render(hbs`<Packages::PasForm::Show @package={{this.packageHasSomeTypes}} />`);

    assert.dom('[data-test-proposedDevelopmentTypes]').hasText('Newly constructed buildings, Demolition, Alteration');
  });
});
