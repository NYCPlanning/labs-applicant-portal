import { Test, TestingModule } from '@nestjs/testing';
import { BblsController } from './bbls.controller';
import { CrmModule } from '../../../crm/crm.module';

describe('Bbls Controller', () => {
  let controller: BblsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CrmModule],
      controllers: [BblsController],
    }).compile();

    controller = module.get<BblsController>(BblsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
