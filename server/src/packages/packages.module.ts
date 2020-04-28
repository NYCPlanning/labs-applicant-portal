import { Module } from '@nestjs/common';
import { PackagesController } from './packages.controller';
import { PackagesService } from './packages.service';
import { CrmModule } from 'src/crm/crm.module';

@Module({
  imports: [CrmModule],
  exports: [PackagesService],
  providers: [PackagesService],
  controllers: [PackagesController],
})
export class PackagesModule {}
