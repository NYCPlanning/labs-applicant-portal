import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { pick } from 'underscore';
import { InvoicePostbackService } from '../invoice-postback/invoice-postback.service';
import { AuthenticateGuard } from '../authenticate.guard';

@Controller('citypay')
export class CityPayController {
  constructor(
    private readonly invoicePostbackService: InvoicePostbackService
  ) {}

  @Post('/postbackpayment')
  async citypayPostback(@Body() body) {
    const allowedAttrs = pick(body, [
      'id',
      'paymentData'
    ]);

    const {
      id,
      paymentData
    } = allowedAttrs;
    
    this.invoicePostbackService.update(id, paymentData);
  }
}
