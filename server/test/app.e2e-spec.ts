import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { oauthMock } from './helpers/mocks/oauth';
import { AppModule } from './../src/app.module';
import { v4 as uuidv4 } from 'uuid';
import nock from 'nock';
import mockedEnv from 'mocked-env';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeAll(function() {
    let restoreEnv;

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

    scope
      .post(uri => uri.includes('api/data/v9.1/contacts'))
      .reply(201, function (uri, requestBody: Record<string, any>) {
        return { ...requestBody, contactid: uuidv4() };
      })
      .persist();
  });

  it('/contacts (GET) is not authenticated', () => {
    return request(app.getHttpServer())
      .get('/contacts')
      .expect(200);
  });
});
