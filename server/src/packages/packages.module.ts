import { Module } from '@nestjs/common';
import { PackagesController } from './packages.controller';
import { PackagesService } from './packages.service';
import { CrmModule } from '../crm/crm.module';
import { PasFormController } from './pas-form/pas-form.controller';
import { ApplicantsController } from './pas-form/applicants/applicants.controller';
import { BblsController } from './pas-form/bbls/bbls.controller';
import { AffectedZoningResolutionsController } from './rwcds-form/affected-zoning-resolution/affected-zoning-resolutions.controller';
import { RwcdsFormController } from './rwcds-form/rwcds-form.controller';
import { LanduseFormController } from './landuse-form/landuse-form.controller';
import { PasFormService } from './pas-form/pas-form.service';
import { RwcdsFormService } from './rwcds-form/rwcds-form.service';
import { LanduseFormService } from './landuse-form/landuse-form.service';
import { DocumentModule } from '../document/document.module';

@Module({
  imports: [CrmModule, DocumentModule],
  exports: [PackagesService],
  providers: [PackagesService, PasFormService, RwcdsFormService, LanduseFormService],
  controllers: [
    PackagesController,
    PasFormController,
    RwcdsFormController,
    LanduseFormController,
    ApplicantsController,
    BblsController,
    AffectedZoningResolutionsController
  ],
})
export class PackagesModule {}
