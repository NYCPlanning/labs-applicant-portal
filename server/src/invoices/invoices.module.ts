import { Module } from '@nestjs/common';
import { CrmModule } from '../crm/crm.module';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';

@Module({
  imports: [CrmModule],
  providers: [InvoicesService],
  controllers: [InvoicesController],
  exports: [InvoicesService]
})
export class InvoicesModule {}
