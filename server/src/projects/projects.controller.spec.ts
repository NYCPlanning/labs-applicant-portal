import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from './projects.controller';
import { ProjectsModule } from './projects.module';
import { ContactService } from '../contact/contact.service';
import { ContactModule } from '../contact/contact.module';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '../config/config.module';

describe('Projects Controller', () => {
  let controller: ProjectsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ProjectsModule, ContactModule, AuthModule, ConfigModule],
      controllers: [ProjectsController],
    }).compile();

    controller = module.get<ProjectsController>(ProjectsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
