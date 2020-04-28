import { Module, MiddlewareConsumer } from '@nestjs/common';
import * as cookieparser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { AuthMiddleware } from './auth.middleware';
import { ConfigModule } from './config/config.module';
import { ContactModule } from './contact/contact.module';
import { CrmModule } from './crm/crm.module';
import { ProjectsModule } from './projects/projects.module';
import { PackagesModule } from './packages/packages.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule,
    ContactModule,
    CrmModule,
    ProjectsModule,
    PackagesModule,
  ],
  controllers: [AppController],
})
export class AppModule {
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
