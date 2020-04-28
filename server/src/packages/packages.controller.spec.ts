import { Test, TestingModule } from '@nestjs/testing';
import { PackagesController } from './packages.controller';
import { PackagesService } from './packages.service';
import { CrmModule } from '../crm/crm.module';

describe('Packages Controller', () => {
  let controller: PackagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CrmModule],
      providers: [PackagesService],
      controllers: [PackagesController],
    }).compile();

    controller = module.get<PackagesController>(PackagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
