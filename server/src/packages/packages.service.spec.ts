import { Test, TestingModule } from '@nestjs/testing';
import { CrmModule } from '../crm/crm.module';
import { PackagesService } from './packages.service';
import { PasFormService } from './pas-form/pas-form.service';
import { RwcdsFormService } from './rwcds-form/rwcds-form.service';
import { DocumentModule } from '../document/document.module';

describe('PackagesService', () => {
  let service: PackagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CrmModule, DocumentModule],
      providers: [PackagesService, PasFormService, RwcdsFormService],
    }).compile();

    service = module.get<PackagesService>(PackagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
