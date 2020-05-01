import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import * as request from 'supertest';

describe('DocumentController (e2e)', () => {
  let app;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Client can POST to /document endpoint and upload a document', () => {
    const server = app.getHttpServer();

    // mock a file that says "buffer"
    const file = Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]);

    return request(server)
      .post('/document')
      .type('form')
      .attach('file', file, 'test.txt')
      .field('instanceId', 'dfa002f2-8fce-e911-a99c-001dd8308076') // corresponds to package w  dcp_name = 2020K0109 - draft LUA - 1
      .field('entityName', 'dcp_package')
      .expect(200)
      .expect({ message: 'Uploaded document successfully.' });
      // TODO: Restore use of cookie
      // .set('Cookie', token)
  });

});
