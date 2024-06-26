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
import {
  InvoicesService,
  DCP_PROJECTINVOICE_CODES,
} from '../invoices/invoices.service';
import { InvoicePostbackService } from '../invoice-postback/invoice-postback.service';

type LineItem = {
  sequence: number;
  amountPaid: number;
  transactionCode: number;
  itemCodeKey: number;
  itemID: string;
  flexField1: string;
  flexField2: string;
  flexField3: string;
  description: string;
  unitPrice: number;
  quantity: number;
  extraData: string;
};

interface PostbackXML {
  PaymentPostBack: {
    agencyRequestID: string;
    receiptNumber: string;
    paidTimestamp: string;
    tender: {
      tenderType: string;
    };
    payer: {
      firstName: string;
      lastName: string;
      streetAddress: string;
      city: string;
      state: string;
      zipPostalCode: number;
      country: string;
      payerEmail: string;
      payerEmailOptin: string;
      phoneNumber: string;
      shipToFirstName: string;
      shipToLastName: string;
      shipToStreetAddress: string;
      shipToCity: string;
      shipToState: string;
      shipToZipPostalCode: string;
      shipToCountry: string;
      shipToPhoneNumber: string;
    };
    cart: {
      lineitems: LineItem[] | LineItem;
    };
  };
}

function getPaymentMethod(tenderType): number {
  switch (tenderType) {
    case 'check':
      return 717170002;
    case 'paypal':
      return 717170006;
    case 'venmo':
      return 717170007;
    default:
      return 717170003; //card
  }
}

@Controller('citypay')
export class CityPayController {
  constructor(
    private readonly config: ConfigService,
    private readonly crmService: CrmService,
    private readonly invoiceService: InvoicesService,
    private readonly invoicePostbackService: InvoicePostbackService,
  ) {}

  @Post('/postbackpayment')
  async citypayPostback(@Req() request: Request, @Body() body) {
    const { ip } = request;

    if (
      !ip.includes(this.config.get('PAYMENT_IP_RANGE')) &&
      process.env.NODE_ENV != 'test'
    ) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const { paymentData } = body;

    const paymentDataParsed = create(
      paymentData,
    ).toObject() as unknown as PostbackXML;

    const {
      PaymentPostBack: {
        agencyRequestID,
        receiptNumber: cartKey,
        paidTimestamp,
        tender: { tenderType },
        payer: {
          firstName,
          lastName,
          streetAddress,
          city,
          state: payerState,
          zipPostalCode,
          country,
        },
        cart: { lineitems: lineItems },
      },
    } = paymentDataParsed;

    const invoiceBody = {
      dcp_paymentdate: paidTimestamp,
      dcp_paymentmethod: getPaymentMethod(tenderType),
      dcp_cpssreceiptnumber: cartKey,
      dcp_payername: firstName + ' ' + lastName,
      dcp_payerstreetaddress: streetAddress,
      dcp_payercity: city,
      dcp_payerstate: payerState,
      dcp_payerzippostalcode: zipPostalCode,
      dcp_payercountry: country,
      dcp_recordtype: 'PAY',
    };

    const {
      records: [{ dcp_projectinvoicepostbackid: postbackId }],
    } = await this.crmService.get(
      'dcp_projectinvoicepostbacks',
      `$select=dcp_projectinvoicepostbackid&$filter=dcp_name eq '${agencyRequestID}'&$top=1`,
    );

    await this.invoicePostbackService.update(postbackId, {
      dcp_name: agencyRequestID,
      dcp_cartkey: cartKey,
      dcp_postbackresponse: paymentData,
      dcp_porcessingtype: 717170000,
    });

    if (Array.isArray(lineItems)) {
      for (let i = 0; i < lineItems.length; i += 1) {
        this.invoiceService.updateByName(lineItems[i].flexField1, {
          ...invoiceBody,
          dcp_totalamountpaid: Number(lineItems[i].amountPaid),
          statuscode: DCP_PROJECTINVOICE_CODES.statuscode.PAID,
        });
      }
    } else {
      this.invoiceService.updateByName(lineItems.flexField1, {
        ...invoiceBody,
        dcp_totalamountpaid: Number(lineItems.amountPaid),
        statuscode: DCP_PROJECTINVOICE_CODES.statuscode.PAID,
      });
    }

    return 1;
  }
}
