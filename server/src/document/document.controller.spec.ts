import { Test, TestingModule } from '@nestjs/testing';
import { DocumentController } from './document.controller';
import { ConfigModule } from '../config/config.module';
import { CrmModule } from '../crm/crm.module';
import { DocumentService } from './document.service';

describe('Document Controller', () => {
  let controller: DocumentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
        CrmModule,
      ],
      providers: [
        DocumentService,
      ],
      controllers: [DocumentController],
    }).compile();

    controller = module.get<DocumentController>(DocumentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
