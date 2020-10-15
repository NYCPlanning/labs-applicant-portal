import Model, { attr } from "@ember-data/model";

export default class InvoiceModel extends Model {
  @attr()
  dcpInvoicedate;

  @attr()
  dcpProjectname;

  @attr()
  dcpName;

  @attr()
  dcpSubtotal;

  @attr()
  dcpTwoHundredPercentRule;

  @attr()
  dcpProjectFees;

  @attr()
  dcpSupplementalFee;

  @attr()
  dcpGrandTotal;

  @attr()
  dcpInvoiceApplications;
}
