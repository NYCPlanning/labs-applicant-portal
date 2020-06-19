import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { CrmService } from '../../crm/crm.service';
import { PasFormService } from '../pas-form/pas-form.service';
import { pick } from 'underscore';
import { RWCDS_FORM_ATTRS } from './rwcds-form.controller';
import { PACKAGE_ATTRS } from '../packages.controller';

@Injectable()
export class RwcdsFormService {
  constructor(
    private readonly crmService: CrmService,
    private readonly pasFormService: PasFormService,
  ) {}

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

  async find(id) {
    const { records: [rwcdsForm] } = await this.crmService.get(`dcp_rwcdsforms`, `
      $filter=
        dcp_rwcdsformid eq ${id}
      &$expand=dcp_package($select=${PACKAGE_ATTRS.join(',')})
    `);

    const { dcp_project } = rwcdsForm;

    // requires info from adjacent latest pasForm
    if (
      rwcdsForm.dcp_projectsitedescription === null
      || rwcdsForm.dcp_proposedprojectdevelopmentdescription === null
    ) {
      const {
        dcp_projectdescriptionproposedarea,
        dcp_projectdescriptionproposeddevelopment,
      } = await this.pasFormService.getLatestPasForm(dcp_project.dcp_projectid);

      if (rwcdsForm.dcp_projectsitedescription === null) {
        rwcdsForm.dcp_projectsitedescription = dcp_projectdescriptionproposedarea;
      }

      if (rwcdsForm.dcp_proposedprojectdevelopmentdescription === null) {
        rwcdsForm.dcp_proposedprojectdevelopmentdescription = dcp_projectdescriptionproposeddevelopment;
      }
    }

    return rwcdsForm;
  }
}
