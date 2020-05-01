import { Module } from '@nestjs/common';
import { PackagesController } from './packages.controller';
import { PackagesService } from './packages.service';
import { CrmModule } from 'src/crm/crm.module';
import { PasFormController } from './pas-form/pas-form.controller';
import { ApplicantsController } from './pas-form/applicants/applicants.controller';
import { PasFormService } from './pas-form/pas-form.service';
import { BblsController } from './pas-form/bbls/bbls.controller';

@Module({
  imports: [CrmModule],
  exports: [PackagesService],
  providers: [PackagesService, PasFormService],
  controllers: [PackagesController, PasFormController, ApplicantsController, BblsController],
})
export class PackagesModule {}
