import { Module } from '@nestjs/common';
import { CrmModule } from '../crm/crm.module';
import { CrmService } from '../crm/crm.service';
import { ContactService } from './contact.service';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';

@Module({
  imports: [
    CrmModule,
    ConfigModule,
  ],
  providers: [ContactService],
  exports: [ContactService],
})
export class ContactModule {}
