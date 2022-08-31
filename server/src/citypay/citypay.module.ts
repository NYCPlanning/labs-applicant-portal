import { Module } from '@nestjs/common';
import { InvoicesModule } from '../invoices/invoices.module';
import { InvoicePostbackModule } from '../invoice-postback/invoice-postback.module';
import { ConfigModule } from '../config/config.module';
import { CrmModule } from '../crm/crm.module';
import { CityPayController } from './citypay.controller';
import { CitypayService } from './citypay.service';

@Module({
  imports: [ConfigModule, CrmModule, InvoicesModule, InvoicePostbackModule],
  providers: [CitypayService],
  controllers: [CityPayController],
  exports: [CitypayService]
})
export class CitypayModule {}
