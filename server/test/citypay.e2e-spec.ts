import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import * as mockedEnvPkg from 'mocked-env';
const { 'default': mockedEnv } = mockedEnvPkg;
import * as request from 'supertest';
import * as nock from 'nock';

describe('CityPayController (e2e)', () => {
  let app;
  let restoreEnv;

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

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeAll(async() => {
    const scope = nock('https://dcppfsuat2.crm9.dynamics.com');

    scope
      .post(uri => uri.includes('api/data/v9.1'))
      .reply(201)
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