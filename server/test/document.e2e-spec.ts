import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import request from 'supertest';
import nock from 'nock';
import mockedEnv from 'mocked-env';
import { doLogin } from './helpers/do-login';
import { extractJWT } from './helpers/extract-jwt';
import { oauthMock } from './helpers/mocks/oauth';
import { v4 as uuidv4 } from 'uuid';

describe('DocumentController (e2e)', () => {
  let app;
  let restoreEnv;

  beforeAll(async () => {
    // Mocks the local environment with dummy data so the app can boot
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
  })

  beforeAll(async() => {
    oauthMock(nock);

    const scope = nock('https://dcppfsuat2.crm9.dynamics.com');

    // mock a dummy contact throughout to support doLogin()
    scope
      .get(uri => uri.includes('api/data/v9.1/contacts'))
      .reply(200, {
        value: [{
          contactid: 'test',
          emailaddress1: 'labs_dl@planning.nyc.gov',
        }], '@odata.context': ''
      })
      .persist();

    // mock a dummy contact throughout to support doLogin()
    scope
      .post(uri => uri.includes('api/data/v9.1/contacts'))
      .reply(201, function(uri, requestBody: Record<string, any>) {
        return { ...requestBody, contactid: uuidv4() };
      })
      .persist();

    scope
      .post(uri => uri.includes('api/data/v9.1/UploadDocument'))
      .reply(204, {
        'Content': 'YnVmZmVy',
        'Entity': {
          '@odata.type': 'Microsoft.Dynamics.CRM.sharepointdocument',
          'locationid': '4b6b8210-9df9-e911-a9a0-001dd8308076',
          'title': 'test.txt'
        },
        'OverwriteExisting': true,
        'ParentEntityReference': {
          '@odata.type': 'Microsoft.Dynamics.CRM.dcp_package',
          'dcp_packageid': 'fe35128e-37a7-e911-a98f-001dd8308047'
        },
        'FolderPath': '',
      })
      .persist();

    scope
      .get(uri => uri.includes('api/data/v9.1/dcp_packages'))
      .reply(200, '1f8b080000000000020a8d8f4f4b033110c5bfca327a5068fe2aed664f15bd692f8278b04586645283bb9b65932d4ae9773785eedddb3ce6bd99df3bc23a3accc86dec33fd6468e02be7213542383b0c3e4d9835b76367b8fbedb10b36156b277008e29c1307c395b8ee28e3595e95d0e780f61bf7946ecea264e81616b0de043bc6147de64ff3a1c7d70dcf31633b928da3b371ea0b0053ff77b7a10b05db123972d0786c132de080ed44d07c1ce772856e5f9abd8b2da87bbd5ad6a6d65b28543361596aa9e5b354d254ac7223fa5cbdbc3d94595d6c9756a1bc01e7514aed35abbd2546462986c65826a572aebe93b55c2de1b43bfd0183194b8f5e010000', {
        'Content-Encoding': 'gzip',
      })
      .persist();

    scope
      .get(uri => uri.includes('api/data/v9.1/sharepointdocumentlocations'))
      .reply(200, [
        '1f8b080000000000020a8d8f3d4fc3301086ff8b6100a9f1475ae224532558bbb0305086ab7da196625f145f2a50d5ff8e3b7404319eee7df53ecf596cc90383749418bf58f4e2c83ce55e29efa669c80b702ddd1c3be9bf13c4e0728946055350d79e3a75d2a8fb880cd7f32e1f61c68942624f6e89987824071c28e587df7fc13f8a95d8ee829b29d3c0f2e5b6f5fcba934c0ce38c8e66ef684985b132ff4f8f218662e6103d7ad10f30665c89138c0b8afefd7cf32f029f45fe4ded85d9d4b6693b6bf6a250fd455d0af6506bbbd14d655dd35608c654d01dd695d6c6fb76ad5b5d3f89cbc7e507535df53469010000'
      ], { 'Content-Encoding': 'gzip' })
      .persist();
  });

  afterAll(() => restoreEnv());
  
  it('Client can POST to /document endpoint and upload a document', async () => {
    const server = app.getHttpServer();
    const token = extractJWT(await doLogin(server, request));

    // mock a file that says "buffer"
    const file = Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]);

    return request(server)
      .post('/documents/package')
      .type('form')
      .attach('file', file, 'test.txt')
      .field('instanceId', 'dfa002f2-8fce-e911-a99c-001dd8308076') // corresponds to package w  dcp_name = 2020K0109 - draft LUA - 1
      .field('entityName', 'dcp_package')
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect({});
  });

});
