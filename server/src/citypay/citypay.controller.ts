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
import { create, fragment } from 'xmlbuilder2';
import { first } from 'rxjs/operators';

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
  ) {
    this.CRM_IMPOSTER_ID = this.config.get('CRM_IMPOSTER_ID');
  }

  async createRequestXML(packageId) {
    const retailPaymentRequestXML = `
      <?xml version='1.0' encoding='UTF-8' standalone='yes'?>
        <RetailPaymentRequest xmlns='${this.config.get('CITYPAY_DOMAIN')}'>
          <profileID>${this.config.get('CITYPAY_USERNAME')}</profileID>
          <profilePassword>${this.config.get('CITYPAY_PASSWORD')}</profilePassword>
          <displayTransactionDescription_1></displayTransactionDescription_1>
          <displayTransactionDescription_2></displayTransactionDescription_2>
          <displayTransactionDescription_3></displayTransactionDescription_3>
          <paymentExtraData></paymentExtraData>
          <postBackURL>
            ${this.config.get('CITYPAY_POSTBACK')}
          </postBackURL>
          <returnFromCartURL>
            ${this.config.get('CITYPAY_RETURN_FROM_CART')}
          </returnFromCartURL>
          <returnFromCheckoutURL>
            ${this.config.get('CITYPAY_RETURN_FROM_CHECKOUT')}
          </returnFromCheckoutURL>
          <agencyRequestID>
            ${this.config.get('CITYPAY_REQUESTID')}
          </agencyRequestID>
        </RetailPaymentRequest>`;
    const retailPaymentRequestLineItemsXML = `
      <retailPaymentRequestLineItems xmlns='${this.config.get('CITYPAY_DOMAIN')}'>
        <agencyIdentifier>${this.config.get('CITYPAY_AGENCYID')}</agencyIdentifier>
        <displayLongDescription>City Environmental Quality Review Fees</displayLongDescription>
        <displayShortDescription_1>City Environmental Quality Review Fees</displayShortDescription_1>
        <displayShortDescription_2>Short Description 2</displayShortDescription_2>
        <displayShortDescription_3></displayShortDescription_3>
        <flexField_1>INV#123</flexField_1>
        <flexField_2>FEE_TYPE1</flexField_2>
        <flexField_3>PACKAGE_NAME1</flexField_3>
        <itemCodeKey></itemCodeKey>
        <transactionCode></transactionCode>
        <lineItemExtraData>This is some extra line item data.</lineItemExtraData>
        <paymentAmount>10.00</paymentAmount>
        <quantity>1</quantity>
        <sequenceNumber>1</sequenceNumber>
        <unitPrice>10.00</unitPrice>
      </retailPaymentRequestLineItems>`;

    const paymentRequest = create(retailPaymentRequestXML);
    const { retailPaymentRequestLineItems: lineItem } = create(retailPaymentRequestLineItemsXML).toObject() as any;

    const { records: [firstPackage] } = await this.crmService.get('dcp_packages', `
        $filter=dcp_packageid eq ${packageId}
        &$expand=dcp_dcp_package_dcp_projectinvoice_package(
          $filter=statuscode eq ${DCP_PROJECTINVOICE_CODES.statuscode.APPROVED}
        )`
    );

    const [ firstInvoice ] = firstPackage.dcp_dcp_package_dcp_projectinvoice_package;

    lineItem.displayLongDescription = firstPackage.dcp_name;
    lineItem.displayShortDescription_1 = firstPackage.dcp_packagetype;
    lineItem.paymentAmount = firstInvoice.dcp_grandtotal;
    lineItem.unitPrice = firstInvoice.dcp_grandtotal;

    const lineItems = fragment({
      retailPaymentRequestLineItems: lineItem
    });

    paymentRequest.root().import(lineItems);
  }

  @Post('/getcartkey')
  async getCartKey(@Body() body) {
    console.log("body: ", body);
    const allowedAttrs = pick(body, [
      'id'
    ]);

    const saleData = this.createRequestXML(allowedAttrs.id)

    const payload = { "saleData": saleData};

    // const options = {
    //   url: `${this.config.get('PAYMENT_BASE_URL')}${this.config.get('PAYMENT_STEP1_URL')}`,
    //   headers: {
    //     'Accept-Encoding': 'gzip, deflate',
    //     'Content-Type': 'application/x-www-form-urlencoded',
    //     'OData-MaxVersion': '4.0',
    //     'OData-Version': '4.0',
    //     Accept: 'application/json',
    //     Prefer: 'return=representation',
    //   },
    //   body: payload,
    //   encoding: null,
    // };

    // return new Promise(resolve => {
    //   Request.get(options, (error, response, body) => {
    //     const stringifiedBody = body.toString('utf-8');
    //     if (response.statusCode >= 400) {
    //       console.log('error', stringifiedBody);
    //     }

    //     resolve(JSON.parse(stringifiedBody));
    //   });
    // });
  }

  @Post('/postbackpayment')
  async citypayPostback() {

  }
}
