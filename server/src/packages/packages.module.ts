import { Module } from '@nestjs/common';
import { PackagesController } from './packages.controller';
import { PackagesService } from './packages.service';
import { CrmModule } from '../crm/crm.module';
import { PasFormController } from './pas-form/pas-form.controller';
import { ApplicantsController } from './pas-form/applicants/applicants.controller';
import { BblsController } from './pas-form/bbls/bbls.controller';
import { RwcdsFormController } from './rwcds-form/rwcds-form.controller';

@Module({
  imports: [CrmModule],
  exports: [PackagesService],
  providers: [PackagesService],
  controllers: [PackagesController, PasFormController, RwcdsFormController, ApplicantsController, BblsController],
})
export class PackagesModule {}
