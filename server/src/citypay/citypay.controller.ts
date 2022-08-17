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
import { first } from 'rxjs/operators';
import axios from 'axios';
import * as  url from 'url';

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
    const { records: [firstPackage] } = await this.crmService.get('dcp_packages', `
        $filter=dcp_packageid eq ${packageId}
        &$expand=dcp_dcp_package_dcp_projectinvoice_package(
          $filter=statuscode eq ${DCP_PROJECTINVOICE_CODES.statuscode.APPROVED}
        )`
    );

    const [ firstInvoice ] = firstPackage.dcp_dcp_package_dcp_projectinvoice_package;

    let getCartKey = null;

    const finalPayload = `<RetailPaymentRequest xmlns="${this.config.get('CITYPAY_DOMAIN')}">
          <profileID>${this.config.get('CITYPAY_USERNAME')}</profileID>
          <profilePassword>${this.config.get('CITYPAY_PASSWORD')}</profilePassword>
          <displayTransactionDescription_1></displayTransactionDescription_1>
          <displayTransactionDescription_2></displayTransactionDescription_2>
          <displayTransactionDescription_3></displayTransactionDescription_3>
          <paymentExtraData></paymentExtraData>
          <postBackURL>${this.config.get('CITYPAY_POSTBACK')}</postBackURL>
          <returnFromCartURL>${this.config.get('CITYPAY_RETURN_FROM_CART')}</returnFromCartURL>
          <returnFromCheckoutURL>${this.config.get('CITYPAY_RETURN_FROM_CHECKOUT')}</returnFromCheckoutURL>
          <agencyRequestID>${this.config.get('CITYPAY_REQUESTID')}</agencyRequestID>
          <retailPaymentRequestLineItems xmlns="${this.config.get('CITYPAY_DOMAIN')}">
            <agencyIdentifier>${this.config.get('CITYPAY_AGENCYID')}</agencyIdentifier>
            <displayLongDescription>${firstPackage.dcp_name}</displayLongDescription>
            <displayShortDescription_1>${firstPackage.dcp_packagetype}</displayShortDescription_1>
            <displayShortDescription_2>Filed EAS</displayShortDescription_2>
            <displayShortDescription_3></displayShortDescription_3>
            <flexField_1>XXXXXXXXXXX</flexField_1>
            <flexField_2>CEQR</flexField_2>
            <flexField_3>XXXXXXXXX_Filed EAS_1</flexField_3>
            <itemCodeKey>XXXXXX</itemCodeKey>
            <transactionCode>XXXXXX</transactionCode>
            <lineItemExtraData>This is some extra line item data.</lineItemExtraData>
            <paymentAmount>${firstInvoice.dcp_grandtotal}</paymentAmount>
            <quantity>1</quantity>
            <sequenceNumber>1</sequenceNumber>
            <unitPrice>${firstInvoice.dcp_grandtotal}</unitPrice>
          </retailPaymentRequestLineItems>
        </RetailPaymentRequest>
        `

    const params = new url.URLSearchParams({ saleData: finalPayload });

    try {
      getCartKey = await axios.post(`${this.config.get('PAYMENT_BASE_URL')}/${this.config.get('PAYMENT_STEP1_URL')}`, params.toString(), {
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        }
      });

      console.log("response: ", getCartKey);
    } catch(e) {
      console.log("error: ", e);
    }

    return getCartKey;
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
