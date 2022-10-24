import Model, { attr } from '@ember-data/model';

export default class InvoiceModel extends Model {
  @attr()
  dcpInvoicedate;

  @attr()
  dcpInvoiceprojectname;

  @attr()
  dcpName;

  @attr()
  dcpSubtotal;

  @attr()
  dcpTwohundredpercentrule;

  @attr()
  dcpProjectfees;

  @attr()
  dcpSupplementalfee;

  @attr()
  dcpGrandtotal;

  @attr()
  dcpPaymentdate;

  @attr()
  lineitems;

  @attr()
  statuscode;

  get isPaid() {
    return this.statuscode === 'Paid';
  }
}
