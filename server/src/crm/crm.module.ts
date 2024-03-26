import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { CrmService } from '../crm/crm.service';
import { AdalProvider } from 'src/provider/adal.provider';

@Module({
  imports: [ConfigModule],
  providers: [CrmService, AdalProvider],
  exports: [CrmService],
})
export class CrmModule {}
