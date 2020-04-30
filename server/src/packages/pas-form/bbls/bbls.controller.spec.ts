import { Test, TestingModule } from '@nestjs/testing';
import { BblsController } from './bbls.controller';
import { PasFormService } from '../pas-form.service';

describe('Bbls Controller', () => {
  let controller: BblsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasFormService],
      controllers: [BblsController],
    }).compile();

    controller = module.get<BblsController>(BblsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
