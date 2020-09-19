import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { CrmModule } from '../crm/crm.module';
import { CitypayService } from './citypay.service';

@Module({
  imports: [ConfigModule, CrmModule],
  providers: [CitypayService],
  exports: [CitypayService]
})
export class CitypayModule {}
