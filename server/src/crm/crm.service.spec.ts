import { Test, TestingModule } from '@nestjs/testing';
import { CrmService } from './crm.service';
import { ConfigModule } from '../config/config.module';

describe('CrmService', () => {
  let service: CrmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
      ],
      providers: [CrmService],
    }).compile();

    service = module.get<CrmService>(CrmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
