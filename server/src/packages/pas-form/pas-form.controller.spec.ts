import { Test, TestingModule } from '@nestjs/testing';
import { PasFormController } from './pas-form.controller';

describe('PasForm Controller', () => {
  let controller: PasFormController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PasFormController],
    }).compile();

    controller = module.get<PasFormController>(PasFormController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
