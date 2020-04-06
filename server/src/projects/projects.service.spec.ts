import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { AuthModule } from '../auth/auth.module';
import { ContactModule } from '../contact/contact.module';
import { ConfigModule } from '../config/config.module';
import { CrmModule } from '../crm/crm.module';

describe('ProjectsService', () => {
  let service: ProjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CrmModule,
        ConfigModule,
        ContactModule,
        AuthModule,
      ],
      providers: [ProjectsService],
      exports: [ProjectsService],
      controllers: [ProjectsController],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
