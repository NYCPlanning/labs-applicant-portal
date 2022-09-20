import { NestFactory } from '@nestjs/core';
import * as fs from 'fs';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './http-exception.filter';

// Attempt to insert SSL certs, if they exist
function generateSSLConfiguration() {
  try {
    return {
      httpsOptions: {
        key: fs.readFileSync(__dirname + '/../ssl/server.key'),
        cert: fs.readFileSync(__dirname + '/../ssl/server.crt'),
      }
    };
  } catch(e) {
    console.log('Skipping local SSL certs: ', e);

    return {};
  }
}

async function bootstrap() {
  // On Heroku instances, default NODE_ENV is 'production'
  console.log(`App NODE_ENV is: ${process.env.NODE_ENV}`)
  console.log(`using single string origin`);

  const app = await NestFactory.create(AppModule, {
    cors: {
      "origin": "https://applicants.planning.nyc.gov",
      "credentials": true,
    },

    ...generateSSLConfiguration(),
  });

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
