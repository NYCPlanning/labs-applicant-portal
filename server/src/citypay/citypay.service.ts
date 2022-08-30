import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { CrmService } from '../crm/crm.service';
import { InvoicesService } from '../invoices/invoices.service';
import { InvoicePostbackService } from '../invoice-postback/invoice-postback.service';
import axios from 'axios';
import { create } from 'xmlbuilder2';
import * as  url from 'url';
import { v4 as uuidv4 } from 'uuid';

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

@Injectable()
export class CitypayService {
  constructor(
    private readonly config: ConfigService,
    private readonly crmService: CrmService,
    private readonly invoiceService: InvoicesService,
    private readonly invoicePostbackService: InvoicePostbackService
  ) {}

  async generateCityPayLink(packageId) {
    console.log('Generating new key...');
    const newCartKey = await this.getCartKey(packageId);

    return this.createCartLink(newCartKey);
  }

  private createCartLink(CartKey) {
    return `${this.config.get('CITYPAY_CUSTOMER_LINK')}?cartKey=${CartKey}`;
  }

  async createRequestXML(projectPackage, agencyRequestID) : Promise<string> {
    const invoices = projectPackage.dcp_dcp_package_dcp_projectinvoice_package;

    const lineItems = [];

    for (let i = 0; i < invoices.length; i++) {
      const curInvoice = invoices[i];

      lineItems.push( `<retailPaymentRequestLineItems xmlns="${this.config.get('CITYPAY_DOMAIN')}">
        <agencyIdentifier>${this.config.get('CITYPAY_AGENCYID')}-${i}</agencyIdentifier>
        <displayLongDescription>${projectPackage.dcp_name}</displayLongDescription>
        <displayShortDescription_1>${projectPackage.dcp_packagetype}</displayShortDescription_1>
        <displayShortDescription_2>XXXXXX</displayShortDescription_2>
        <displayShortDescription_3></displayShortDescription_3>
        <flexField_1>XXXXXXXXXXX</flexField_1>
        <flexField_2>XXXX</flexField_2>
        <flexField_3>XXXXXXXXX_XXXXXXX_X</flexField_3>
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

  async getCartKey(packageId) {
    const agencyRequestID = uuidv4();

    const { records: [firstPackage] } = await this.crmService.get('dcp_packages', `
        $filter=dcp_packageid eq ${packageId}
        &$expand=dcp_dcp_package_dcp_projectinvoice_package(
          $filter=statuscode eq ${DCP_PROJECTINVOICE_CODES.statuscode.APPROVED}
        )`
    );

    const requestXML = await this.createRequestXML(firstPackage, agencyRequestID);

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

      const associatedInvoices = firstPackage.dcp_dcp_package_dcp_projectinvoice_package.map(projectInvoice => `/dcp_projectinvoices(${projectInvoice.dcp_projectinvoiceid})`)

      // create new Project Invoice Postback in CRM
      await this.invoicePostbackService.create({
        dcp_name: agencyRequestID,
        dcp_cartkey: cartKey,
        dcp_postbackrequest: requestXML,
        'dcp_dcp_projectinvoicepostback_dcp_projectinvoice_cartkey@odata.bind': associatedInvoices
      });

      return cartKey;
    } catch(e) {
      console.log("error: ", e);
    }
  }
}
