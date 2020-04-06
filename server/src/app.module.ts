import { Module, MiddlewareConsumer } from '@nestjs/common';
import * as cookieparser from 'cookie-parser';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { AuthMiddleware } from './auth.middleware';
import { ConfigModule } from './config/config.module';
import { ContactModule } from './contact/contact.module';
import { CrmModule } from './crm/crm.module';
import { ProjectsModule } from './projects/projects.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule,
    ContactModule,
    CrmModule,
    ProjectsModule
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
  }
}
