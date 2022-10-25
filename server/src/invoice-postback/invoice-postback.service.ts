import { Injectable } from '@nestjs/common';
import { CrmService } from '../crm/crm.service';
import { pick } from 'underscore';
import {
  INVOICE_POSTBACK_ATTRS_GET,
  INVOICE_POSTBACK_ATTRS_UPDATE,
} from './invoice-postback.attrs';


@Injectable()
export class InvoicePostbackService {
  constructor(private readonly crmService: CrmService) {}

  async create(props) {
    const allowedAttrs = pick(props, INVOICE_POSTBACK_ATTRS_GET);

    const result = await this.crmService.create('dcp_projectinvoicepostbacks', allowedAttrs);

    return result;
  }

  async update(id, props) {
    const allowedAttrs = pick(props, INVOICE_POSTBACK_ATTRS_UPDATE);

    try {
      const result = await this.crmService.update('dcp_projectinvoicepostbacks', id, allowedAttrs);
    } catch(e) {
      console.log("update failed: ", e);
    }

    return 1;
  }
}
