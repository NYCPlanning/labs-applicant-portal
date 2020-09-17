import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { promises as fs } from 'fs';
import * as superagent from 'superagent';
import { ConfigService } from '../config/config.service';
import { CrmService } from '../crm/crm.service';

const MSApplicantPortalCookieName = '.AspNet.ApplicationCookie'
const MSApplicantPortalLogin = 'https://nycdcppfs.dynamics365portals.us/SignIn';
const MSApplicantPortalToken = 'https://nycdcppfs.dynamics365portals.us/_services/auth/token';
const MSApplicantPortalCartKey = 'https://appservicedcpzapprod.azurewebsites.net/api/payment/getcartkey';
const CityPayLink = 'https://a836-citypay.nyc.gov/citypay/retail/dcp-zap/processPreparedRetail';

@Injectable()
export class CitypayService {
  constructor(
    private readonly config: ConfigService,
    private readonly crmService: CrmService,
  ) {
    // this.generateCartKey('4100e89f-26f8-ea11-a813-001dd8309076');
  }

  async detectExistingCartKey(packageId) {
    const { records: [projectInvoice = {}] } = await this.crmService.get('dcp_projectinvoices', `
      $filter=_dcp_package_value eq ${packageId}
      &$expand=dcp_cartkeylup
    `);

    console.log(projectInvoice.dcp_cartkeylup);
    // https://nycdcppfs.crm9.dynamics.com/api/data/v9.1/dcp_projectinvoices(BDD802B2-26F8-EA11-A813-001DD8309076)?$expand=dcp_cartkeylup,dcp_package
  }

  // generates cookies by headless login to MS Applicant Portal
  private async stealCookies() {
    const browserPromise = puppeteer.launch();
    try {
      const browser = await browserPromise;
      const page = await browser.newPage();

      await page.goto(MSApplicantPortalLogin);
      await page.type('#Username', this.config.get('MS_APPLICANT_PORTAL_USERNAME'));
      await page.type('#Password', this.config.get('MS_APPLICANT_PORTAL_PASSWORD'));
      await page.click('#submit-signin-local');
      await page.waitForResponse(response => response.url().includes(MSApplicantPortalLogin));

      return page.cookies();
    } catch (e) {
      console.log(`having trouble... ${e}`);

      // can't stop, won't stop...
      // sometimes MS applicant portal is slow
      // and puppeteer times out.
      return this.stealCookies();
    } finally {
      const browser = await browserPromise;

      browser.close();
    }
  }

  async generateCartKey(packageId) {
    try {
      const cookies = await this.stealCookies();
      const microsoftPortalCookie = cookies.find(cookie => cookie.name === MSApplicantPortalCookieName)

      // fetch the JWT to sign the next req
      const MSPortalJWTRequest = await superagent
        .get(MSApplicantPortalToken)
        .query({ client_id: '29f7ab7e-e9bb-4b20-9b8f-4760a8313b28' })
        .withCredentials()
        .set('Cookie', `${MSApplicantPortalCookieName}=${microsoftPortalCookie.value}`)
        .set('Accept-Encoding', 'gzip, deflate, br');
      const cartKeyJWT = MSPortalJWTRequest.body.toString();

      // fetch the CartKey used to identify the transaction on CityPay
      const { body: { CartKey } } = await superagent
        .post(MSApplicantPortalCartKey)
        .set('Authorization', `Bearer ${cartKeyJWT}`)
        .send(`id=${packageId}`);

      const cityPayCart = `${CityPayLink}?cartKey=${CartKey}`;
      console.log(cityPayCart);

      return cityPayCart;
    } catch (e) {
      console.log(`There was a problem: ${e.toString()}`);
    }
  }
}
