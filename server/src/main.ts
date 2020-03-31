import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: [/\.planninglabs\.nyc$/, /\.planning\.nyc\.gov$/,'http://localhost:4200','http://localhost:3000'],
      credentials: true,
    },
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
