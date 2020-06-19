import { Module } from '@nestjs/common';
import { PackagesController } from './packages.controller';
import { PackagesService } from './packages.service';
import { CrmModule } from '../crm/crm.module';
import { PasFormController } from './pas-form/pas-form.controller';
import { ApplicantsController } from './pas-form/applicants/applicants.controller';
import { BblsController } from './pas-form/bbls/bbls.controller';
import { RwcdsFormController } from './rwcds-form/rwcds-form.controller';
import { PasFormService } from './pas-form/pas-form.service';
import { RwcdsFormService } from './rwcds-form/rwcds-form.service';
import { RwcdsFormModule } from './rwcds-form/rwcds-form.module';
import { PasFormModule } from './pas-form/pas-form.module';

@Module({
  imports: [CrmModule, RwcdsFormModule, PasFormModule],
  exports: [PackagesService],
  providers: [PackagesService, PasFormService, RwcdsFormService],
  controllers: [PackagesController, PasFormController, RwcdsFormController, ApplicantsController, BblsController],
})
export class PackagesModule {}
