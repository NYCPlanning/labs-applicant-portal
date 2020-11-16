import { Injectable } from '@nestjs/common';
import { CrmService } from '../crm/crm.service';
import { overwriteCodesWithLabels } from '../_utils/overwrite-codes-with-labels';
import { INVOICE_ATTRS } from './invoices.attrs';

export function joinLabels(records) {
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
}
