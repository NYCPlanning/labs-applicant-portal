import { Module } from '@nestjs/common';
import { PackagesController } from './packages.controller';
import { PackagesService } from './packages.service';
import { CrmModule } from '../crm/crm.module';
import { PasFormController } from './pas-form/pas-form.controller';
import { ApplicantsController } from './pas-form/applicants/applicants.controller';
import { BblsController } from './bbls/bbls.controller';
import { AffectedZoningResolutionsController } from './rwcds-form/affected-zoning-resolution/affected-zoning-resolutions.controller';
import { RelatedActionsController } from './landuse-form/related-actions/related-actions.controller';
import { SitedatahFormsController } from './landuse-form/sitedatah-forms/sitedatah-forms.controller';
import { LanduseGeographyController } from './landuse-form/landuse-geography/landuse-geography.controller';
import { ZoningMapChangesController } from './landuse-form/zoning-map-changes/zoning-map-change.controller';
import { LanduseActionsController } from './landuse-form/landuse-actions/landuse-actions.controller';
import { RwcdsFormController } from './rwcds-form/rwcds-form.controller';
import { LanduseFormController } from './landuse-form/landuse-form.controller';
import { PasFormService } from './pas-form/pas-form.service';
import { RwcdsFormService } from './rwcds-form/rwcds-form.service';
import { LanduseFormService } from './landuse-form/landuse-form.service';
import { DocumentModule } from '../document/document.module';
import { CitypayModule } from '../citypay/citypay.module';
import { CeqrInvoiceQuestionnairesController } from './ceqr-invoice-questionnaires/ceqr-invoice-questionnaires.controller';

@Module({
  imports: [CrmModule, DocumentModule, CitypayModule],
  exports: [PackagesService],
  providers: [PackagesService, PasFormService, RwcdsFormService, LanduseFormService],
  controllers: [
    PackagesController,
    PasFormController,
    RwcdsFormController,
    LanduseFormController,
    ApplicantsController,
    BblsController,
    AffectedZoningResolutionsController,
    RelatedActionsController,
    SitedatahFormsController,
    LanduseActionsController,
    LanduseGeographyController,
    ZoningMapChangesController,
    CeqrInvoiceQuestionnairesController,
  ],
})
export class PackagesModule {}
