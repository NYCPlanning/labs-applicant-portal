import {
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import { create } from 'xmlbuilder2';
import { InvoicePostbackService } from '../invoice-postback/invoice-postback.service';

@Controller('citypay')
export class CityPayController {
  constructor(
    private readonly invoicePostbackService: InvoicePostbackService
  ) {}
  
  @Post('/postbackpayment')
  async citypayPostback(@Body() body) {
    const { paymentData } = body;

    console.log(`paymentData: ${paymentData}`);

    const {
      PaymentPostBack: {
        agencyRequestID,
        receiptNumber: cartKey
      }
    } = create(paymentData).toObject() as {
      PaymentPostBack: {
        agencyRequestID: string,
        receiptNumber: string
      }
    };

    console.log("request ID, cartkey: " + agencyRequestID  + " " + cartKey);

    this.invoicePostbackService.update(agencyRequestID, {
        dcp_name: agencyRequestID,
        dcp_cartkey: cartKey,
        dcp_postbackresponse: paymentData,
        dcp_processingtype: '717170000',
    });

    return 1;
  }
}
