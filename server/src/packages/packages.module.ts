import { Module } from '@nestjs/common';
import { PackagesController } from './packages.controller';
import { PackagesService } from './packages.service';
import { CrmModule } from 'src/crm/crm.module';
import { PasFormController } from './pas-form/pas-form.controller';
import { ApplicantsController } from './pas-form/applicants/applicants.controller';

@Module({
  imports: [CrmModule],
  exports: [PackagesService],
  providers: [PackagesService],
  controllers: [PackagesController, PasFormController, ApplicantsController],
})
export class PackagesModule {}
