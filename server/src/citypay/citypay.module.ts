import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { CrmModule } from '../crm/crm.module';

@Module({
  imports: [ConfigModule, CrmModule],
})
export class CitypayModule {}
