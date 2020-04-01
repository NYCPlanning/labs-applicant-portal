import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { ConfigService } from './config/config.service';
import { ContactService } from './contact/contact.service';
import { CrmService } from './crm/crm.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AppController],
  providers: [AppService, AuthService, ConfigService, ContactService, CrmService],
})
export class AppModule {}
