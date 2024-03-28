import { Module } from '@nestjs/common';
import { CrmModule } from '../crm/crm.module';
import { InvoicePostbackService } from './invoice-postback.service';

@Module({
  imports: [CrmModule],
  providers: [InvoicePostbackService],
  exports: [InvoicePostbackService],
})
export class InvoicePostbackModule {}
