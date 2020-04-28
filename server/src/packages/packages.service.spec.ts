import { Test, TestingModule } from '@nestjs/testing';
import { CrmModule } from '../crm/crm.module';
import { PackagesService } from './packages.service';

describe('PackagesService', () => {
  let service: PackagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CrmModule],
      providers: [PackagesService],
    }).compile();

    service = module.get<PackagesService>(PackagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
