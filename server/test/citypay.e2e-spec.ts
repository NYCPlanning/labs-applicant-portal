import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import * as mockedEnvPkg from 'mocked-env';
const { 'default': mockedEnv } = mockedEnvPkg;
import { oauthMock } from './helpers/mocks/oauth';
import * as request from 'supertest';
import * as nock from 'nock';
import { v4 as uuidv4 } from 'uuid';
import { CrmService } from '../src/crm/crm.service';
import { InvoicesService } from '../src/invoices/invoices.service';
import { InvoicePostbackService } from '../src/invoice-postback/invoice-postback.service';
import { ConfigService } from '../src/config/config.service';

describe('CityPayController (e2e)', () => {
  let app;
  let restoreEnv;
  let configService: ConfigService;
  let crmService: CrmService;
  let invoiceService: InvoicesService;
  let invoicePostbackService: InvoicePostbackService;

  beforeAll(async () => {
    restoreEnv = mockedEnv({
      CRM_HOST: 'https://dcppfsuat2.crm9.dynamics.com',
      AUTHORITY_HOST_URL: 'https://login.microsoftonline.com',
      CRM_URL_PATH: '/api/data/v9.1/',
      CLIENT_ID: 'test',
      CLIENT_SECRET: 'test',
      TENANT_ID: 'test',
      TOKEN_PATH: '/oauth2/token',

      ZAP_TOKEN_SECRET: 'test',
      NYCID_TOKEN_SECRET: 'test',
    });

    configService = new ConfigService('empty.env');
    crmService = new CrmService(configService);
    invoicePostbackService = new InvoicePostbackService(crmService);
    invoiceService = new InvoicesService(crmService);

    jest.spyOn(crmService, 'get').mockImplementation(async (entity, query, ...options) => {
      console.log(`called crmService.get(${entity}, ${query}, ${options})`);

      return {
        count: 3,
        records: [
          {
            "@odata.etag": "W/\"299453083\"",
            "dcp_projectinvoicepostbackid": "fb1fab0c-a33e-ed11-9daf-001dd83096d3"
          }
        ]
      }
    });

    jest.spyOn(crmService, 'update').mockImplementation(async (entity, query, ...options) => {
      console.log(`called crmService.update(${entity}, ${query}, ${options})`);

      return 1;
    });

    jest.spyOn(invoicePostbackService, 'update').mockImplementation(async (id, body) => {
      console.log(`called invoiceService.update(${id}, ${body})`);

      return 1;
    })

    jest.spyOn(invoiceService, 'update').mockImplementation(async (id, body) => {
      console.log(`called invoiceService.update(${id}, ${body})`);

      return 1;
    })

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(CrmService)
      .useValue(crmService)
      .overrideProvider(InvoicesService)
      .useValue(invoiceService)
      .overrideProvider(invoicePostbackService)
      .useValue(invoicePostbackService)
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeAll(async() => {
    oauthMock(nock);

    const scope = nock('https://dcppfsuat2.crm9.dynamics.com');

    scope
      .post(uri => uri.includes('api/data/v9.1'))
      .reply(201)
      .persist();

    scope
      .get(uri => uri.includes('api/data/v9.1'))
      .reply(200, {
        "@odata.context": "https://dcppfsuat2.crm9.dynamics.com/api/data/v9.1/$metadata#dcp_projectinvoicepostbacks(dcp_projectinvoicepostbackid)",
        "@Microsoft.Dynamics.CRM.totalrecordcount": -1,
        "@Microsoft.Dynamics.CRM.totalrecordcountlimitexceeded": false,
        "@Microsoft.Dynamics.CRM.globalmetadataversion": "298165205",
        "value": [
          {
            "@odata.etag": "W/\"299453083\"",
            "dcp_projectinvoicepostbackid": "fb1fab0c-a33e-ed11-9daf-001dd83096d3"
          }
        ]
      }
      )
      .persist();
  });

  afterAll(() => restoreEnv());

  it('citypay/postbackpayment endpoint', async() => {
    const server = app.getHttpServer();

    return request(server)
      .post('/citypay/postbackpayment')
      .type('json')
      .send({
        paymentData: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
          <PaymentPostBack xmlns="http://gov.nyc.dof.citypay">
              <receiptNumber>CPY201541234</receiptNumber>
              <agencyRequestID>11asdf30-asdf-401d-asdf-5f5b8c63asdf</agencyRequestID>
              <paidTimestamp>2022-09-02T14:30:42.181-04:00</paidTimestamp>
              <status>PAID</status>
              <serviceFeeAmount>0</serviceFeeAmount>
              <cart>
                  <agencyIdentifier>DCPZAP</agencyIdentifier>
                  <lineitems>
                      <sequence>0</sequence>
                      <amountPaid>1000.1</amountPaid>
                      <transactionCode>11112</transactionCode>
                      <itemCodeKey>900312</itemCodeKey>
                      <itemID>DCPZAP-0</itemID>
                      <flexField1>XXXXXXXXXXX</flexField1>
                      <flexField2>XXXX</flexField2>
                      <flexField3>XXXXXXXXX_XXXXXXX_X</flexField3>
                      <description>2021Q0402_Filed LU Package_2</description>
                      <unitPrice>1000.1</unitPrice>
                      <quantity>1</quantity>
                      <extraData>This is some extra line item data.</extraData>
                  </lineitems>
                  <lineitems>
                      <sequence>1</sequence>
                      <amountPaid>279</amountPaid>
                      <transactionCode>11112</transactionCode>
                      <itemCodeKey>900312</itemCodeKey>
                      <itemID>DCPZAP-1</itemID>
                      <flexField1>XXXXXXXXXXX</flexField1>
                      <flexField2>XXXX</flexField2>
                      <flexField3>XXXXXXXXX_XXXXXXX_X</flexField3>
                      <description>2021Q0402_Filed LU Package_2</description>
                      <unitPrice>279</unitPrice>
                      <quantity>1</quantity>
                      <extraData>This is some extra line item data.</extraData>
                  </lineitems>
                  <extraData></extraData>
              </cart>
              <payer>
                  <firstName>sponge</firstName>
                  <lastName>bob</lastName>
                  <streetAddress>ocean city</streetAddress>
                  <city>somecity</city>
                  <state>NY</state>
                  <zipPostalCode>23132</zipPostalCode>
                  <country>US</country>
                  <payerEmail>sponge@bob.com</payerEmail>
                  <payerEmailOptin>false</payerEmailOptin>
                  <phoneNumber>(123) 123-1234</phoneNumber>
                  <shipToFirstName></shipToFirstName>
                  <shipToLastName></shipToLastName>
                  <shipToStreetAddress></shipToStreetAddress>
                  <shipToCity></shipToCity>
                  <shipToState></shipToState>
                  <shipToZipPostalCode></shipToZipPostalCode>
                  <shipToCountry></shipToCountry>
                  <shipToPhoneNumber></shipToPhoneNumber>
              </payer>
              <tender>
                  <amount>1279.10</amount>
                  <tenderType>check</tenderType>
                  <accountNumber>4242</accountNumber>
              </tender>
          </PaymentPostBack>`
      }).expect(201, '1');
  })
});