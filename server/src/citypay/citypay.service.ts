import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as superagent from 'superagent';
import { ConfigService } from '../config/config.service';
import { CrmService } from '../crm/crm.service';

const MAX_RETRIES = 5;
const MS_APPLICANT_PORTAL = {
  COOKIE_NAME: '.AspNet.ApplicationCookie',
  SIGN_IN_PAGE: 'https://nycdcppfs.dynamics365portals.us/SignIn',
  TOKEN_API: 'https://nycdcppfs.dynamics365portals.us/_services/auth/token',
  CART_KEY_API: 'https://appservicedcpzapprod.azurewebsites.net/api/payment/getcartkey',
}

const CITY_PAY_LINK = 'https://a836-citypay.nyc.gov/citypay/retail/dcp-zap/processPreparedRetail';

@Injectable()
export class CitypayService {
  constructor(
    private readonly config: ConfigService,
    private readonly crmService: CrmService,
  ) {
    this.findOrCreateCartKey('4100e89f-26f8-ea11-a813-001dd8309076')
      .then(key => console.log(key))
      .catch(e => console.log(e));
  }

  async findOrCreateCartKey(packageId) {
    const latestCartKey = await this.findLatestCartKey(packageId);

    // TODO: this finds the latest one, but if an invoice is deleted,
    // it won't detect that and won't re-gen the cart
    if (latestCartKey) {
      console.log('Found existing key!');

      return this.createCartLink(latestCartKey.dcp_cartkey);
    } else {
      console.log('Generating new key...');
      const newCartKey = await this.generateCartKey(packageId);

      return this.createCartLink(newCartKey);
    }
  }

  async findLatestCartKey(packageId) {
    const { records: [projectInvoice] } = await this.crmService.get('dcp_projectinvoices', `
      $filter=
        _dcp_package_value eq ${packageId}
      &$expand=dcp_cartkeylup
      &$orderby=createdon desc
    `);

    return projectInvoice?.dcp_cartkeylup;
  }

  private createCartLink(CartKey) {
    return `${CITY_PAY_LINK}?cartKey=${CartKey}`;
  }

  // generates cookies by headless login to MS Applicant Portal
  private async stealCookies(retries = MAX_RETRIES) {
    const browserPromise = puppeteer.launch();

    try {
      const browser = await browserPromise;
      const page = await browser.newPage();

      await page.goto(MS_APPLICANT_PORTAL.SIGN_IN_PAGE);
      await page.type('#Username', this.config.get('MS_APPLICANT_PORTAL_USERNAME'));
      await page.type('#Password', this.config.get('MS_APPLICANT_PORTAL_PASSWORD'));
      await page.click('#submit-signin-local');
      await page.waitForResponse(response => response.url().includes(MS_APPLICANT_PORTAL.SIGN_IN_PAGE));

      return page.cookies();
    } catch (e) {
      console.log(`having trouble... ${e}`);

      // can't stop, won't stop...
      // sometimes MS applicant portal is slow
      // and puppeteer times out.
      if (retries) {
        return this.stealCookies(retries - 1);
      } else {
        throw new Error(`Could not create cookie, maybe something is wrong with the username/password? ${e.toString()}`);
      }
    } finally {
      const browser = await browserPromise;

      browser.close();
    }
  }

  async generateCartKey(packageId, retries = 5) {
    try {
      const cookies = await this.stealCookies();
      const microsoftPortalCookie = cookies.find(cookie => cookie.name === MS_APPLICANT_PORTAL.COOKIE_NAME)

      // fetch the JWT to sign the next req
      const MSPortalJWTRequest = await superagent
        .get(MS_APPLICANT_PORTAL.TOKEN_API)
        .query({ client_id: '29f7ab7e-e9bb-4b20-9b8f-4760a8313b28' })
        .withCredentials()
        .set('Cookie', `${MS_APPLICANT_PORTAL.COOKIE_NAME}=${microsoftPortalCookie.value}`)
        .set('Accept-Encoding', 'gzip, deflate, br');
      const cartKeyJWT = MSPortalJWTRequest.body.toString();

      // fetch the CartKey used to identify the transaction on CityPay
      const { body: { CartKey } } = await superagent
        .post(MS_APPLICANT_PORTAL.CART_KEY_API)
        .set('Authorization', `Bearer ${cartKeyJWT}`)
        .send(`id=${packageId}`);

      return CartKey;
    } catch (e) {
      console.log(`There was a problem: ${e.toString()}`);
      console.log('Trying again...');

      if (retries) {
        return this.generateCartKey(packageId, retries - 1);
      } else {
        throw new Error(`Could not generate the key for some reason: ${e.toString}`);
      }
    }
  }
}
