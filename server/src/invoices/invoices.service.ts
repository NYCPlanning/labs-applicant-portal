import { Injectable } from '@nestjs/common';
import { CrmService } from '../crm/crm.service';
import { pick } from 'underscore';
import { overwriteCodesWithLabels } from '../_utils/overwrite-codes-with-labels';
import { INVOICE_ATTRS } from './invoices.attrs';

export const DCP_PROJECTINVOICE_CODES = {
  statuscode: {
    APPROVED: 2,
    PAID: 717170000,
  },

  statecode: {
    ACTIVE: 0,
    INACTIVE: 1,
  },

  dcp_invoicetype: {
    LAND_USE: 717170000,
    CEQR: 717170001,
    TYPE_II: 717170002,
  },
};

export function joinLabels(records, attrs = INVOICE_ATTRS) {
  return overwriteCodesWithLabels(records, INVOICE_ATTRS);
}

@Injectable()
export class InvoicesService {
  constructor(private readonly crmService: CrmService) {}

  async getInvoice(id) {
    const { records } = await this.crmService.get(
      'dcp_projectinvoices',
      `
      $filter=dcp_projectinvoiceid eq ${id}
      &$expand=dcp_dcp_projectinvoice_dcp_invoicelineitem_projectinvoice
    `,
    );
    const [invoice] = joinLabels(records);

    return {
      lineitems: overwriteCodesWithLabels(
        invoice.dcp_dcp_projectinvoice_dcp_invoicelineitem_projectinvoice,
        ['dcp_fee'],
      ),
      ...invoice,
    };
  }

  // gets Project Invoices for given Package
  async getPackageInvoices(packageId) {
    const { records } = await this.crmService.get(
      'dcp_projectinvoices',
      `
      $filter=dcp_packageid eq ${packageId} and
      and statuscode eq 2
      and statecode eq 1
    `,
    );

    return records;
  }

  async update(id, props) {
    const allowedAttrs = pick(props, INVOICE_ATTRS);

    try {
      const result = await this.crmService.update(
        'dcp_projectinvoices',
        id,
        allowedAttrs,
      );
    } catch (e) {
      console.log('update failed: ', e);
    }

    return 1;
  }

  async updateByName(dcpName, props) {
    const {
      records: [{ dcp_projectinvoiceid: invoiceId }],
    } = await this.crmService.get(
      'dcp_projectinvoices',
      `$select=dcp_projectinvoiceid&$filter=dcp_name eq '${dcpName}'&$top=1`,
    );

    await this.update(invoiceId, props);
  }
}
