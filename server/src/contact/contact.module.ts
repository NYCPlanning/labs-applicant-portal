import { Module } from '@nestjs/common';
import { CrmModule } from '../crm/crm.module';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { ConfigModule } from '../config/config.module';
import { NycidService } from './nycid/nycid.service';

@Module({
  imports: [
    CrmModule,
    ConfigModule,
  ],
  providers: [ContactService, NycidService],
  exports: [ContactService, NycidService],
  controllers: [ContactController],
})
export class ContactModule {}
