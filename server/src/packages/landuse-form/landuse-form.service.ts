import {
  Injectable,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { CrmService } from '../../crm/crm.service';
import { LANDUSE_FORM_ATTRS } from './landuse-form.attrs';

const ACTIVE_STATECODE = 0;

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
        dcp_dcp_applicantrepinformation_dcp_landuse,
        dcp_dcp_projectbbl_dcp_landuse($filter=statecode eq ${ACTIVE_STATECODE}),
        dcp_dcp_landuse_dcp_relatedactions,
        dcp_dcp_landuse_dcp_landuseaction
    `);

    return {
      ...landuseForm,
    };
  }
}
