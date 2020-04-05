import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ContactModule } from '../contact/contact.module';
import { ConfigModule } from '../config/config.module';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
        ContactModule,
      ],
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
