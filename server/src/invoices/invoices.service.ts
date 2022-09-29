import { Injectable } from '@nestjs/common';
import { CrmService } from '../crm/crm.service';
import { pick } from 'underscore';
import { overwriteCodesWithLabels } from '../_utils/overwrite-codes-with-labels';
import { INVOICE_ATTRS } from './invoices.attrs';

export function joinLabels(records, attrs = INVOICE_ATTRS) {
  return overwriteCodesWithLabels(records, INVOICE_ATTRS);
}

@Injectable()
export class InvoicesService {
  constructor(private readonly crmService: CrmService) {}

  async getInvoice(id) {
    const { records } = await this.crmService.get('dcp_projectinvoices', `
      $filter=dcp_projectinvoiceid eq ${id}
      &$expand=dcp_dcp_projectinvoice_dcp_invoicelineitem_projectinvoice
    `);
    const [invoice] = joinLabels(records);

    return {
      lineitems: overwriteCodesWithLabels(invoice.dcp_dcp_projectinvoice_dcp_invoicelineitem_projectinvoice, ['dcp_fee']),
      ...invoice
    };
  }

  // gets Project Invoices for given Package
  async getPackageInvoices(packageId) {
    const { records } = await this.crmService.get('dcp_projectinvoices', `
      $filter=dcp_packageid eq ${packageId} and
      and statuscode eq 2
      and statecode eq 1
    `)

    return records;
  }

  async update(id, props) {
    console.log("original props: ");
    console.log(props);

    const allowedAttrs = pick(props, INVOICE_ATTRS);

    try {
      console.log("updating dcp_projectinvoice with id ", id);
      console.log("attribute are:")
      console.log(allowedAttrs);

      const result = await this.crmService.update('dcp_projectinvoices', id, allowedAttrs);
    } catch(e) {
      console.log("update failed: ", e);
    }

    return 1;
  }
}
