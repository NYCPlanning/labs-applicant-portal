import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { CrmModule } from '../crm/crm.module';
import { CityPayController } from './citypay.controller';
import { CitypayService } from './citypay.service';

@Module({
  imports: [ConfigModule, CrmModule],
  providers: [CitypayService],
  controllers: [CityPayController],
  exports: [CitypayService]
})
export class CitypayModule {}
