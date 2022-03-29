import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as superagent from 'superagent';
import { ConfigService } from '../config/config.service';

const MAX_RETRIES = 5;
const MS_APPLICANT_PORTAL = {
  COOKIE_NAME: '.AspNet.ApplicationCookie',
  SIGN_IN_PAGE: 'https://nycdcppfs.dynamics365portals.us/SignIn',
  TOKEN_API: 'https://nycdcppfs.dynamics365portals.us/_services/auth/token',
  CART_KEY_API: 'https://appservicedcpzapprod.azurewebsites.net/api/payment/getcartkey',

   // security measure — they sign forms with this token
  MICROSOFT_SIGN_IN_REQUEST_TOKEN: 'https://nycdcppfs.dynamics365portals.us/_layout/tokenhtml'
}

const CITY_PAY_LINK = 'https://a836-citypay.nyc.gov/citypay/retail/dcp-zap/processPreparedRetail';

@Injectable()
export class CitypayService {
  constructor(
    private readonly config: ConfigService,
  ) {}

  async generateCityPayLink(packageId) {
    console.log('Generating new key...');
    const newCartKey = await this.generateCartKey(packageId);

    return this.createCartLink(newCartKey);
  }

  private createCartLink(CartKey) {
    return `${CITY_PAY_LINK}?cartKey=${CartKey}`;
  }

  private async generateCartKey(packageId, retries = MAX_RETRIES) {
    console.log('getting cart key...');

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
      const cartKeyResponse = await superagent
        .post(MS_APPLICANT_PORTAL.CART_KEY_API)
        .set('Authorization', `Bearer ${cartKeyJWT}`)
        .send(`id=${packageId}`);

      console.log("Cart key response: ", cartKeyResponse);

      const { body: { CartKey } } = cartKeyResponse;

      return CartKey;
    } catch (e) {
      console.log(`There was a problem: ${e.toString()}`);
      console.log('Trying again...');

      if (retries) {
        return this.generateCartKey(packageId, retries - 1);
      } else {
        throw new Error(`Could not generate the key for some reason: ${e.toString()}`);
      }
    }
  }

  // generates cookies by headless login to MS Applicant Portal
  private async stealCookies(retries = MAX_RETRIES) {
    const browserPromise = puppeteer.launch({ args: ['--no-sandbox'] });

    try {
      const browser = await browserPromise;
      const page = await browser.newPage();

      await page.goto(MS_APPLICANT_PORTAL.SIGN_IN_PAGE);

      // this gets dynamically inserted after a handshake event with MS
      await page.waitForSelector('[action="/SignIn"]');

      // enter credentials
      await page.type('#Username', this.config.get('MS_APPLICANT_PORTAL_USERNAME'));

      // Something changed MCS-portal side for this selector
      // the selector changed from Password -> PasswordValue
      // this code will try both just in case.
      try {
        await page.type('#Password', this.config.get('MS_APPLICANT_PORTAL_PASSWORD'));
      } catch (e) {
        await page.type('#PasswordValue', this.config.get('MS_APPLICANT_PORTAL_PASSWORD'));
      }

      // click signin, but await for the response with cookies
      page.click('#submit-signin-local');

      await page.waitForNavigation({
        waitUntil: 'networkidle0'
      });

      return page.cookies();
    } catch (e) {
      console.log(`having trouble... ${e}`);

      // can't stop, won't stop...
      // sometimes puppeteer times out.
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
}
