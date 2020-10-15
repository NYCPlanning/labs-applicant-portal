import { module, test } from "qunit";
import { visit, currentURL } from "@ember/test-helpers";
import { setupApplicationTest } from "ember-qunit";
import { setupMirage } from "ember-cli-mirage/test-support";

module("Acceptance | invoices", function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test("visiting /invoices", async function (assert) {
    this.server.create("invoice", {
      dcpName: 1234567893,
      dcpProjectname: "305-315 Tillbert Street (CEQR)",
      dcpInvoicedate: "04/18/20",
      dcpInvoiceApplications: [
        {
          dcpApplicationNumber: "210081RCR",
          dcpAction: "RC",
          dcpFee: "$160.00",
        },
        {
          dcpApplicationNumber: "[ULURP Number]",
          dcpAction: "[Code]",
          dcpFee: "[amount]",
        },
        {
          dcpApplicationNumber: "[ULURP Number]",
          dcpAction: "[Code]",
          dcpFee: "[amount]",
        },
      ],
      dcpSubtotal: "$160.00",
      dcpTwoHundredPercentRule: "$320.00",
      dcpProjectFees: "$160.00",
      dcpSupplementalFee: "$0.00",
      dcpGrandTotal: "$160.00",
    });

    await visit("/invoices/1");
    // remove after you're done! :)
    await this.pauseTest();

    assert.equal(currentURL(), "/invoices/1");
  });
});
