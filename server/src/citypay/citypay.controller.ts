import {
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import { create } from 'xmlbuilder2';
import { CrmService } from '../crm/crm.service';
import { InvoicePostbackService } from '../invoice-postback/invoice-postback.service';

@Controller('citypay')
export class CityPayController {
  constructor(
    private readonly crmService: CrmService,
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

    console.log(`Request ID: ${agencyRequestID}`)
    console.log(`Cart Key: ${cartKey}`);

    const {
      records: [
        {
          dcp_projectinvoicepostbackid: postbackId
        }
      ]
    } = await this.crmService.get('dcp_projectinvoicepostbacks',
      `$select=dcp_projectinvoicepostbackid&$filter=dcp_name eq ${agencyRequestID}&$top=1`
    )

    console.log("postbackId: ", postbackId);

    this.invoicePostbackService.update(postbackId, {
        dcp_name: agencyRequestID,
        dcp_cartkey: cartKey,
        dcp_postbackresponse: paymentData,
        dcp_porcessingtype: 717170000,
    });

    return 1;
  }
}
