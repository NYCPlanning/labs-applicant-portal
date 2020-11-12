import { Injectable } from '@nestjs/common';
import { CrmService } from '../crm/crm.service';
import { overwriteCodesWithLabels } from '../_utils/overwrite-codes-with-labels';
import { INVOICE_ATTRS } from './invoices.attrs';

@Injectable()
export class InvoicesService {
  constructor(private readonly crmService: CrmService) {}

  async getInvoice(id) {
    const { records } = await this.crmService.get('dcp_projectinvoices', `
      $filter=dcp_projectinvoiceid eq ${id}
      &$expand=dcp_dcp_projectinvoice_dcp_invoicelineitem_projectinvoice
    `);
    const [invoice] = overwriteCodesWithLabels(records, INVOICE_ATTRS);

    return {
      lineitems: invoice.dcp_dcp_projectinvoice_dcp_invoicelineitem_projectinvoice,
      ...invoice
    };
  }
}
