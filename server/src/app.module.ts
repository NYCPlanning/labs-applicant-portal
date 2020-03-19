import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import * as cookieparser from 'cookie-parser';
import * as compression from 'compression';
import { AppController } from './app.controller';
import { ConfigService } from './config/config.service';
import { ConfigModule } from './config/config.module';
import { AuthModule } from './auth/auth.module';
import { DocumentModule } from './document/document.module';
import { AuthMiddleware } from './auth.middleware';
import { ContactModule } from './contact/contact.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule,
    AuthModule,
    DocumentModule,
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get('DATABASE_URL'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
        ssl: false,
      }),
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    ContactModule,
  ],
  controllers: [AppController],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(cookieparser())
      .forRoutes('*');

    consumer
      .apply(AuthMiddleware)
      .forRoutes('*');

    consumer
      .apply(bodyParser.json({
        type: 'application/vnd.api+json'
      }))
      .forRoutes('*');

    consumer
      .apply(compression())
      .forRoutes('*');
  }
}