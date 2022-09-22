import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { create } from 'xmlbuilder2';
import { ConfigService } from '../config/config.service';
import { CrmService } from '../crm/crm.service';
import { InvoicePostbackService } from '../invoice-postback/invoice-postback.service';

@Controller('citypay')
export class CityPayController {
  constructor(
    private readonly config: ConfigService,
    private readonly crmService: CrmService,
    private readonly invoicePostbackService: InvoicePostbackService
  ) {}
  
  @Post('/postbackpayment')
  async citypayPostback(@Req() request: Request, @Body() body) {
    console.log(`Request: ${request}` );
    console.log(`request.cookies: ${request.cookies}`);
    console.log(`request.hostname: ${request.hostname}`);
    console.log(`request.ip: ${request.ip}`);
    console.log(`request.ips: ${request.ips}`);
    console.log(`request.signedCookies: ${request.signedCookies}`);
    console.log(`request.subdomains: ${request.subdomains}`);
    console.log(`request.ip: ${request.ip}`);
    console.log(`request.originalUrl: ${request.ips}`);

    const { ip } = request;

    if ( ip != this.config.get('CITYPAY_IP')) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const { paymentData } = body;

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

    const {
      records: [
        {
          dcp_projectinvoicepostbackid: postbackId
        }
      ]
    } = await this.crmService.get('dcp_projectinvoicepostbacks',
      `$select=dcp_projectinvoicepostbackid&$filter=dcp_name eq ${agencyRequestID}&$top=1`
    )

    this.invoicePostbackService.update(postbackId, {
        dcp_name: agencyRequestID,
        dcp_cartkey: cartKey,
        dcp_postbackresponse: paymentData,
        dcp_porcessingtype: 717170000,
    });

    return 1;
  }
}
