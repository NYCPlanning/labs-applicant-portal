import { Module } from '@nestjs/common';
import { CrmModule } from '../crm/crm.module';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';

@Module({
  imports: [
    CrmModule,
  ],
  providers: [ContactService],
  exports: [ContactService],
  controllers: [ContactController],
})
export class ContactModule {}
