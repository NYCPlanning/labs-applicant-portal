import { Test, TestingModule } from '@nestjs/testing';
import { RwcdsFormService } from './rwcds-form.service';

describe('RwcdsFormService', () => {
  let service: RwcdsFormService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RwcdsFormService],
    }).compile();

    service = module.get<RwcdsFormService>(RwcdsFormService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
