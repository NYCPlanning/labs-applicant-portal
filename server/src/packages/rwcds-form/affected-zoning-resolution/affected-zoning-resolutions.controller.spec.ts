import { Test, TestingModule } from '@nestjs/testing';
import { AffectedZoningResolutionsController } from './affected-zoning-resolutions.controller';
import { CrmModule } from '../../../crm/crm.module';

describe('AffectedZoningResolutions Controller', () => {
  let controller: AffectedZoningResolutionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CrmModule],
      controllers: [AffectedZoningResolutionsController],
    }).compile();

    controller = module.get<AffectedZoningResolutionsController>(AffectedZoningResolutionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});