import { NestFactory } from '@nestjs/core';
import * as fs from 'fs';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './http-exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express';

// Attempt to insert SSL certs, if they exist
function generateSSLConfiguration() {
  try {
    return {
      httpsOptions: {
        key: fs.readFileSync(__dirname + '/../ssl/server.key'),
        cert: fs.readFileSync(__dirname + '/../ssl/server.crt'),
      },
    };
  } catch (e) {
    console.log('Skipping local SSL certs: ', e);

    return {};
  }
}

async function bootstrap() {
  let allowedOrigins = <any[]>[
    /\.tangoyankee\.io$/,
    /\.planninglabs\.nyc$/,
    /\.planning\.nyc\.gov$/,
    /\.netlify\.app$/,
    "https://qa--applicant-portal.netlify.app"
  ];

  // On Heroku instances, default NODE_ENV is 'production'
  console.log(`App NODE_ENV is: ${process.env.NODE_ENV}`);

  if (!['production', 'staging'].includes(process.env.NODE_ENV)) {
    allowedOrigins = allowedOrigins.concat([
      'http://localhost:4200',
      'https://localhost:4200',
      // 'https://local.planninglabs.nyc:4200',
      'https://local.tangoyankee.io:4200',
    ]);
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },

    ...generateSSLConfiguration(),
  });

  app.enable('trust proxy');

  app.useGlobalFilters(new HttpExceptionFilter());


  await app.listen(process.env.PORT || 3000);
}
bootstrap();
