import { Test, TestingModule } from '@nestjs/testing';
import { PackagesController } from './packages.controller';
import { PackagesService } from './packages.service';
import { CrmModule } from '../crm/crm.module';
import { PasFormService } from './pas-form/pas-form.service';
import { RwcdsFormService } from './rwcds-form/rwcds-form.service';
import { DocumentModule } from '../document/document.module';

describe('Packages Controller', () => {
  let controller: PackagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CrmModule, DocumentModule],
      providers: [PackagesService, PasFormService, RwcdsFormService],
      controllers: [PackagesController],
    }).compile();

    controller = module.get<PackagesController>(PackagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
