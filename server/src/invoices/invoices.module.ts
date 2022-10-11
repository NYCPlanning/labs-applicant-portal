import { Module } from '@nestjs/common';
import { CrmModule } from '../crm/crm.module';
import { InvoicesService } from './invoices.service';
import { ConfigModule } from '../config/config.module';
import { InvoicesController } from './invoices.controller';

@Module({
  imports: [ConfigModule, CrmModule],
  providers: [InvoicesService],
  controllers: [InvoicesController],
  exports: [InvoicesService]
})
export class InvoicesModule {}
