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
  },

  dcp_invoicetype: {
    LAND_USE: 717170000,
    CEQR: 717170001,
    TYPE_II: 717170002
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

      const isCEQR : boolean = curInvoice.dcp_invoicetype === DCP_PROJECTINVOICE_CODES.dcp_invoicetype.CEQR || DCP_PROJECTINVOICE_CODES.dcp_invoicetype.TYPE_II ? true : false;
      const isLU : boolean = curInvoice.dcp_invoicetype === DCP_PROJECTINVOICE_CODES.dcp_invoicetype.LAND_USE ? true : false;
      const shortDesc1 : string =  isCEQR ? "CEQR Fees" : (isLU ? "Land Use Fees" : null);
      const itemCodeKey : number = isCEQR ?  900312 : (isLU ? 900313 : null);
      const transactionCode : number = isCEQR ?  11112 : (isLU ? 11113 : null);

      lineItems.push( `<retailPaymentRequestLineItems xmlns="${this.config.get('CITYPAY_DOMAIN')}">
        <agencyIdentifier>${this.config.get('CITYPAY_AGENCYID')}-${i}</agencyIdentifier>
        <displayLongDescription>${projectPackage.dcp_name}</displayLongDescription>
        <displayShortDescription_1>${shortDesc1}</displayShortDescription_1>
        <displayShortDescription_2>${projectPackage.dcp_packagetype}</displayShortDescription_2>
        <displayShortDescription_3></displayShortDescription_3>
        <flexField_1>${curInvoice.dcp_name}</flexField_1>
        <flexField_2>${curInvoice.dcp_invoicetype}</flexField_2>
        <flexField_3></flexField_3>
        <itemCodeKey>${itemCodeKey}</itemCodeKey>
        <transactionCode>${transactionCode}</transactionCode>
        <lineItemExtraData>This is some extra line item data.</lineItemExtraData>
        <paymentAmount>${curInvoice.dcp_grandtotal}</paymentAmount>
        <quantity>1</quantity>
        <sequenceNumber>${invoices.length}</sequenceNumber>
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

    try {
      const { records: [firstPackage] } = await this.crmService.get('dcp_packages', `
          $filter=dcp_packageid eq ${packageId}
          &$expand=dcp_dcp_package_dcp_projectinvoice_package(
            $filter=statuscode eq ${DCP_PROJECTINVOICE_CODES.statuscode.APPROVED}
          )`
      );

      const requestXML = await this.createRequestXML(firstPackage, agencyRequestID);

      const params = new url.URLSearchParams({ saleData: requestXML });

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

      console.log("Creating new postback... ");
      console.log(`dcp_name: ${agencyRequestID}`);
      console.log(`dcp_cartkey: ${cartKey}`);
      console.log("associaated invoices: ", associatedInvoices);

      // create new Project Invoice Postback in CRM
      await this.invoicePostbackService.create({
        dcp_name: agencyRequestID,
        dcp_cartkey: cartKey,
        dcp_postbackrequest: requestXML,
        'dcp_dcp_projectinvoicepostback_dcp_projectinvoice_cartkey@odata.bind': associatedInvoices
      });

      return cartKey;
    } catch(e) {
      console.log("getCartKey error: ", e);
    }
  }
}
