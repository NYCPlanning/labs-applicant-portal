import { Test, TestingModule } from '@nestjs/testing';
import { PasFormService } from './pas-form.service';

describe('PasFormService', () => {
  let service: PasFormService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasFormService],
    }).compile();

    service = module.get<PasFormService>(PasFormService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
