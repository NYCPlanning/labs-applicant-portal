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
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: ['https://develop.applicant-portal.planninglabs.nyc/', /\.netlify\.app/, /\.planninglabs\.nyc$/, /\.planning\.nyc\.gov$/, 'http://localhost:4200', 'https://localhost:4200', /\.netlify\.com/, 'https://local.planninglabs.nyc:4200'],
      credentials: true,
    },

    ...generateSSLConfiguration(),
  });

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
