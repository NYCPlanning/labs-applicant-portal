import {
  Controller,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthenticateGuard } from '../authenticate.guard';
import { JsonApiSerializeInterceptor } from '../json-api-serialize.interceptor';
import { InvoicesService } from './invoices.service';
import { INVOICE_ATTRS } from './invoices.attrs';

@UseInterceptors(
  new JsonApiSerializeInterceptor('invoices', {
    id: 'dcp_projectinvoiceid',
    attributes: [
      ...INVOICE_ATTRS,

      // virtual property — see the service. not serialized into a model for simplicity
      'lineitems',
    ],
  }),
)
@UseGuards(AuthenticateGuard)
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoiceService: InvoicesService) {}

  @Get('/:id')
  getInvoice(@Param('id') id) {
    return this.invoiceService.getInvoice(id);
  }
}
