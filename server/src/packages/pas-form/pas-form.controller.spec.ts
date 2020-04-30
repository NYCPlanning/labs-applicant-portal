import { Test, TestingModule } from '@nestjs/testing';
import { PasFormController } from './pas-form.controller';
import { PasFormService } from './pas-form.service';

describe('PasForm Controller', () => {
  let controller: PasFormController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasFormService],
      controllers: [PasFormController],
    }).compile();

    controller = module.get<PasFormController>(PasFormController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
