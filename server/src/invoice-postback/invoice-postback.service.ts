import { Injectable } from '@nestjs/common';
import { CrmService } from '../crm/crm.service';
import { create } from 'xmlbuilder2';
import { pick } from 'underscore';
import { INVOICE_POSTBACK_ATTRS } from './invoice-postback.attrs';

@Injectable()
export class InvoicePostbackService {
  constructor(private readonly crmService: CrmService) {}

  async create(props) {
    const { records } = await this.crmService.create('dcp_projectinvoicepostbacks', {
      ...props
    });

    return {};
  }

  async update(id, body) {
    const allowedAttrs = pick(body, INVOICE_POSTBACK_ATTRS);

    try {
      const res = await this.crmService.update('dcp_projectinvoicepostbacks', id, allowedAttrs);
    } catch (e) {

    }
  }
}
