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
    const allowedAttrs = pick(INVOICE_POSTBACK_ATTRS_GET);

    const { records } = await this.crmService.create('dcp_projectinvoicepostbacks', allowedAttrs);

    return records;
  }

  async update(id, props) {
    const allowedAttrs = pick(INVOICE_POSTBACK_ATTRS_UPDATE);

    const { records } = await this.crmService.update('dcp_projectinvoicepostbacks', id, allowedAttrs);

    return records;
  }
}
