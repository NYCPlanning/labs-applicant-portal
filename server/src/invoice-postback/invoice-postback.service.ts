import { Injectable } from '@nestjs/common';
import { CrmService } from '../crm/crm.service';


@Injectable()
export class InvoicePostbackService {
  constructor(private readonly crmService: CrmService) {}

  async create(props) {
    const { records } = await this.crmService.create('dcp_projectinvoicepostbacks', {
      ...props
    });

    return {};
  }
}
