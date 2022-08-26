import {
  Controller,
  Post,
  Body,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { CrmService } from '../crm/crm.service';
import { AuthenticateGuard } from '../authenticate.guard';
import { JsonApiDeserializePipe } from '../json-api-deserialize.pipe';
import * as Request from 'request';
import { pick } from 'underscore';
import { create } from 'xmlbuilder2';
import { first } from 'rxjs/operators';
import axios from 'axios';
import * as  url from 'url';
import { v4 as uuidv4 } from 'uuid';
import { InvoicesService } from '../invoices/invoices.service';
import { InvoicePostbackService } from '../invoice-postback/invoice-postback.service';

const DCP_PROJECTINVOICE_CODES = {
  statuscode: {
    APPROVED: 2,
    PAID: 717170000,
  },

  statecode: {
    ACTIVE: 0,
    INACTIVE: 1,
  }
};

@Controller('citypay')
export class CityPayController {
  CRM_IMPOSTER_ID = '';

  constructor(
    private readonly config: ConfigService,
    private readonly crmService: CrmService,
    private readonly invoiceService: InvoicesService,
    private readonly invoicePostbackService: InvoicePostbackService
  ) {
    this.CRM_IMPOSTER_ID = this.config.get('CRM_IMPOSTER_ID');
  }

  async createRequestXML(packageId, agencyRequestID) : Promise<string> {
    const { records: [firstPackage] } = await this.crmService.get('dcp_packages', `
        $filter=dcp_packageid eq ${packageId}
        &$expand=dcp_dcp_package_dcp_projectinvoice_package(
          $filter=statuscode eq ${DCP_PROJECTINVOICE_CODES.statuscode.APPROVED}
        )`
    );

    const invoices = firstPackage.dcp_dcp_package_dcp_projectinvoice_package;

    const lineItems = [];

    for (let i = 0; i < invoices.length; i++) {
      const curInvoice = invoices[i];

      lineItems.push( `<retailPaymentRequestLineItems xmlns="${this.config.get('CITYPAY_DOMAIN')}">
        <agencyIdentifier>${this.config.get('CITYPAY_AGENCYID')}-${i}</agencyIdentifier>
        <displayLongDescription>${firstPackage.dcp_name}</displayLongDescription>
        <displayShortDescription_1>${firstPackage.dcp_packagetype}</displayShortDescription_1>
        <displayShortDescription_2>Filed EAS</displayShortDescription_2>
        <displayShortDescription_3></displayShortDescription_3>
        <flexField_1>XXXXXXXXXXX</flexField_1>
        <flexField_2>CEQR</flexField_2>
        <flexField_3>XXXXXXXXX_Filed EAS_1</flexField_3>
        <itemCodeKey>900312</itemCodeKey>
        <transactionCode>11112</transactionCode>
        <lineItemExtraData>This is some extra line item data.</lineItemExtraData>
        <paymentAmount>${curInvoice.dcp_grandtotal}</paymentAmount>
        <quantity>1</quantity>
        <sequenceNumber>${i}</sequenceNumber>
        <unitPrice>${curInvoice.dcp_grandtotal}</unitPrice>
      </retailPaymentRequestLineItems>`)
    }

    return `<RetailPaymentRequest xmlns="${this.config.get('CITYPAY_DOMAIN')}">
          <profileID>${this.config.get('CITYPAY_USERNAME')}</profileID>
          <profilePassword>${this.config.get('CITYPAY_PASSWORD')}</profilePassword>
          <displayTransactionDescription_1></displayTransactionDescription_1>
          <displayTransactionDescription_2></displayTransactionDescription_2>
          <displayTransactionDescription_3></displayTransactionDescription_3>
          <paymentExtraData></paymentExtraData>
          <postBackURL>${this.config.get('CITYPAY_POSTBACK')}</postBackURL>
          <returnFromCartURL>${this.config.get('CITYPAY_RETURN_FROM_CART')}</returnFromCartURL>
          <returnFromCheckoutURL>${this.config.get('CITYPAY_RETURN_FROM_CHECKOUT')}</returnFromCheckoutURL>
          <agencyRequestID>${agencyRequestID}</agencyRequestID>
          ${lineItems.join('')}
        </RetailPaymentRequest>`;
  }

  @Post('/getcartkey')
  async getCartKey(@Body() body) {
    const allowedAttrs = pick(body, [
      'id'
    ]);

    const agencyRequestID = uuidv4();

    const requestXML = await this.createRequestXML(allowedAttrs.id, agencyRequestID);

    const params = new url.URLSearchParams({ saleData: requestXML });

    try {
      let citypayResponse = null;

      citypayResponse = await axios.post(`${this.config.get('PAYMENT_BASE_URL')}/${this.config.get('PAYMENT_STEP1_URL')}`, params.toString(), {
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        }
      });

      const { data: xmlResponse } = citypayResponse;

      const {
        RetailPaymentResponse: {
          receiptNumber: cartKey
        }
      } = create(xmlResponse).toObject() as {
        RetailPaymentResponse: {
          receiptNumber: string
        }
      };

      // create new Project Invoice Postback in CRM
      await this.invoicePostbackService.create({
        dcp_name: agencyRequestID,
        dcp_cartkey: cartKey,
        dcp_postbackrequest: requestXML
      });


      return { CartKey: cartKey };
    } catch(e) {
      console.log("error: ", e);
    }
  }

  @Post('/postbackpayment')
  async citypayPostback() {

  }
}
