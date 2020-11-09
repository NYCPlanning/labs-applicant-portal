import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | invoices', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('visiting /invoices', async function (assert) {
    this.server.create('invoice', {
      dcpName: 1234567893,
      dcpProjectname: '305-315 Tillbert Street (CEQR)',
      dcpInvoicedate: '04/18/20',
      dcpInvoiceapplications: [
        {
          dcpApplicationnumber: '210081RCR',
          dcpAction: 'RC',
          dcpFee: '$160.00',
        },
        {
          dcpApplicationnumber: '[ULURP Number]',
          dcpAction: '[Code]',
          dcpFee: '[amount]',
        },
        {
          dcpApplicationnumber: '[ULURP Number]',
          dcpAction: '[Code]',
          dcpFee: '[amount]',
        },
      ],
      dcpSubtotal: '$160.00',
      dcpTwohundredpercentrule: '$320.00',
      dcpProjectfees: '$160.00',
      dcpSupplementalfee: '$0.00',
      dcpGrandtotal: '$160.00',
    });

    await visit('/invoices/1');

    assert.equal(currentURL(), '/invoices/1');
  });
});
