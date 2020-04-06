import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AuthService } from './auth/auth.service';
import { ContactService } from './contact/contact.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AuthService,
          // how you provide the injection token in a test instance
          useValue: new (class Mock { }),
        },
        {
          provide: ContactService,
          // how you provide the injection token in a test instance
          useValue: new (class Mock { }),
        },
      ],
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should be defined', () => {
      expect(appController).toBeDefined();
    });
  });
});
