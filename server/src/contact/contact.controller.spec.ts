import { Test, TestingModule } from '@nestjs/testing';
import { ContactModule } from '../contact/contact.module';
import { ContactController } from './contact.controller';

describe('Contact Controller', () => {
  let controller: ContactController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ContactModule],
      controllers: [ContactController],
    }).compile();

    controller = module.get<ContactController>(ContactController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
