import { Test, TestingModule } from '@nestjs/testing';
import { ContactService } from './contact.service';
import { CrmModule } from '../crm/crm.module';

describe('ContactService', () => {
  let service: ContactService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CrmModule,
      ],
      providers: [ContactService],
    }).compile();

    service = module.get<ContactService>(ContactService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
