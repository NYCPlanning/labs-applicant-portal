import { Test, TestingModule } from '@nestjs/testing';
import { ApplicantsController } from './applicants.controller';
import { PasFormService } from '../pas-form.service';

describe('Applicants Controller', () => {
  let controller: ApplicantsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasFormService],
      controllers: [ApplicantsController],
    }).compile();

    controller = module.get<ApplicantsController>(ApplicantsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
