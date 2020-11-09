import { Injectable } from '@nestjs/common';
import { CrmService } from '../crm/crm.service';

@Injectable()
export class InvoicesService {
  constructor(private readonly crmService: CrmService) {}

  async getInvoice(id) {
    const { records: [invoice] } = await this.crmService.get('dcp_projectinvoices', `
      $filter=dcp_projectinvoiceid eq ${id}
    `);

    console.log(invoice)
    return invoice;
  }
}
