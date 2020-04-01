import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { ConfigService } from './config/config.service';
import { ContactService } from './contact/contact.service';
import { CrmService } from './crm/crm.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { ContactModule } from './contact/contact.module';
import { CrmModule } from './crm/crm.module';

@Module({
  imports: [AuthModule, ConfigModule, ContactModule, CrmModule],
  controllers: [AppController],
  // providers: [AppService, AuthService, ConfigService, ContactService, CrmService],
})
export class AppModule {}
