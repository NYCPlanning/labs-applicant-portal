import { Module } from '@nestjs/common';
import { CrmModule } from '../crm/crm.module';
import { AccountsController } from './accounts.controller';

@Module({
  imports: [CrmModule],
  providers: [],
  exports: [],
  controllers: [AccountsController],
})
export class AccountsModule {}
