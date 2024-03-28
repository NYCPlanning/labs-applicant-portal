import { Test, TestingModule } from '@nestjs/testing';
import { CrmModule } from '../../crm/crm.module';
import { RwcdsFormService } from './rwcds-form.service';
import { CrmService } from '../../crm/crm.service';
import { PasFormService } from '../pas-form/pas-form.service';

describe('RwcdsFormService', () => {
  let rwcdsFormService: RwcdsFormService;
  let crmService: CrmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CrmModule],
      providers: [RwcdsFormService, PasFormService],
    }).compile();

    rwcdsFormService = module.get<RwcdsFormService>(RwcdsFormService);
    crmService = module.get<CrmService>(CrmService);
  });

  it('RWCDS Form Service Should be defined', () => {
    expect(rwcdsFormService).toBeDefined();
  });

  it('update() should update both RWCDS form and project if rwcdsForm.buildyear is included ', async () => {
    jest
      .spyOn(rwcdsFormService, '_getPackageProjectId')
      .mockImplementation(async () => '123');
    const updateMock = jest
      .spyOn(crmService, 'update')
      .mockImplementation(async () => true);

    await rwcdsFormService.update('123', { dcp_buildyear: 2020 });

    expect(updateMock).toHaveBeenCalledWith('dcp_rwcdsforms', '123', {
      dcp_buildyear: 2020,
    });
    expect(updateMock).toHaveBeenCalledWith('dcp_projects', '123', {
      dcp_anticipatedyearbuilt: 2020,
    });
    expect(updateMock).toHaveBeenCalledTimes(2);
  });

  it('update() should only update RWCDS form if rwcdsForm.buildyear is NOT included ', async () => {
    jest
      .spyOn(rwcdsFormService, '_getPackageProjectId')
      .mockImplementation(async () => '123');
    const updateMock = jest
      .spyOn(crmService, 'update')
      .mockImplementation(async () => true);

    await rwcdsFormService.update('123', { dcp_projectname: 'Chelsea' });

    expect(updateMock).toHaveBeenCalledWith('dcp_rwcdsforms', '123', {
      dcp_projectname: 'Chelsea',
    });
    expect(updateMock).toHaveBeenCalledTimes(1);
  });
});
