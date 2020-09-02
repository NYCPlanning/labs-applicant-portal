import {
  Injectable,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { CrmService } from '../../crm/crm.service';
import { LANDUSE_FORM_ATTRS } from './landuse-form.attrs';

@Injectable()
export class LanduseFormService {
  constructor(private readonly crmService: CrmService) {}

  async find(id) {
    const { records: [landuseForm] } = await this.crmService.get(`dcp_landuses`, `
      $select=${LANDUSE_FORM_ATTRS.join(',')}
      &$filter=
        dcp_landuseid eq ${id}
      &$expand=
        dcp_dcp_applicantinformation_dcp_landuse,
        dcp_dcp_applicantrepinformation_dcp_landuse
    `);

    return {
      ...landuseForm,
    };
  }
}
