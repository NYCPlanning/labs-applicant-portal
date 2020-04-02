import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { ContactModule } from './contact/contact.module';
import { CrmModule } from './crm/crm.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule,
    ContactModule,
    CrmModule
  ],
  controllers: [AppController],
})
export class AppModule {}
