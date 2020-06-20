import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { CrmService } from '../../crm/crm.service';
import { pick } from 'underscore';
import { RWCDS_FORM_ATTRS } from './rwcds-form.controller';

@Injectable()
export class RwcdsFormService {
  constructor(private readonly crmService: CrmService) {}

  async _getPackageProjectId(packageId):Promise<String> {
    const { records: [firstPackage] } = await this.crmService.get('dcp_packages', `
      $select=_dcp_project_value
      &$filter=dcp_packageid eq ${packageId}
    `);

    if (!firstPackage) {
      return undefined;
    }

    const { _dcp_project_value } = firstPackage;

    return _dcp_project_value;
  }

  async update(id, body) {
    const allowedAttrs = pick(body, RWCDS_FORM_ATTRS);
    const { package: packageId } = body;
    const projectId = await this._getPackageProjectId(packageId);

    if(!projectId) {
      return new HttpException('Package not found for RWCDS Form', HttpStatus.NOT_FOUND);
    }

    await this.crmService.update('dcp_rwcdsforms', id, allowedAttrs);

    if (allowedAttrs.hasOwnProperty('dcp_buildyear')) {
      await this.crmService.update('dcp_projects', projectId, {
        dcp_anticipatedyearbuilt: allowedAttrs.dcp_buildyear,
      });
    }
  }
}
