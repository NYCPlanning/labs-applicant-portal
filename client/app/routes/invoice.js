import Route from "@ember/routing/route";

export default class InvoiceRoute extends Route {
  model() {
    return {
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
    };
  }
}
