import { Module } from '@nestjs/common';
import { CrmModule } from '../crm/crm.module';
import { InvoicesService } from './invoices.service';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [ConfigModule, CrmModule],
  providers: [InvoicesService],
  controllers: [],
  exports: [InvoicesService]
})
export class InvoicesModule {}
