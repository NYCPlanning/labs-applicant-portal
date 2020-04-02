import { Module } from '@nestjs/common';
import { CrmModule } from '../crm/crm.module';
import { ContactService } from './contact.service';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [
    CrmModule,
    ConfigModule,
  ],
  providers: [ContactService],
  exports: [ContactService],
})
export class ContactModule {}
