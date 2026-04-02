import { Module, MiddlewareConsumer } from '@nestjs/common';
import { SentryModule } from "@sentry/nestjs/setup";
import { APP_FILTER } from "@nestjs/core";
import { SentryGlobalFilter } from "@sentry/nestjs/setup";
import bodyParser from 'body-parser';
import compression from 'compression';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { AuthMiddleware } from './auth.middleware';
import { ConfigModule } from './config/config.module';
import { ContactModule } from './contact/contact.module';
import { CrmModule } from './crm/crm.module';
import { ProjectsModule } from './projects/projects.module';
import { AccountsModule } from './accounts/accounts.module';
import { PackagesModule } from './packages/packages.module';
import { DocumentModule } from './document/document.module';
import { CitypayService } from './citypay/citypay.service';
import { CitypayModule } from './citypay/citypay.module';
import { ZoningResolutionsModule } from './zoning-resolutions/zoning-resolutions.module';
import { InvoicesModule } from './invoices/invoices.module';
import { InvoicePostbackModule } from './invoice-postback/invoice-postback.module';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
    CitypayService
  ],
  imports: [
    SentryModule.forRoot(),
    AuthModule,
    AccountsModule,
    ConfigModule,
    ContactModule,
    CrmModule,
    ProjectsModule,
    PackagesModule,
    DocumentModule,
    CitypayModule,
    ZoningResolutionsModule,
    InvoicesModule,
    InvoicePostbackModule,
  ],
  controllers: [AppController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');

    consumer
      .apply(
        bodyParser.json({
          type: 'application/vnd.api+json',
        }),
      )
      .forRoutes('*');

    consumer.apply(compression()).forRoutes('*');
  }
}
