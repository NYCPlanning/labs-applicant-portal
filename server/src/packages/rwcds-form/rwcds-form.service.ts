import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { CrmService } from '../../crm/crm.service';
import { PasFormService } from '../pas-form/pas-form.service';
import { pick } from 'underscore';
import { RWCDS_FORM_ATTRS } from './rwcds-form.attrs';
import { PACKAGE_ATTRS } from '../packages.attrs';

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
      &$expand=dcp_rwcdsform_dcp_affectedzoningresolution_rwcdsform
    `);

    const { _dcp_projectid_value } = rwcdsForm;

    // run syncActions to synchronize dcp_projectaction and dcp_affectedzoningresolution entities
    const affectedZoningResolutions = rwcdsForm.dcp_rwcdsform_dcp_affectedzoningresolution_rwcdsform;
    this.syncActions(_dcp_projectid_value, id, affectedZoningResolutions);

    // requires info from adjacent latest pasForm
    if (
      rwcdsForm.dcp_projectsitedescription === null
      || rwcdsForm.dcp_proposedprojectdevelopmentdescription === null
    ) {
      const {
        dcp_projectdescriptionproposedarea,
        dcp_projectdescriptionproposeddevelopment,
      } = await this.pasFormService.getLatestPasForm(_dcp_projectid_value);

      if (rwcdsForm.dcp_projectsitedescription === null) {
        rwcdsForm.dcp_projectsitedescription = dcp_projectdescriptionproposedarea;
      }

      if (rwcdsForm.dcp_proposedprojectdevelopmentdescription === null) {
        rwcdsForm.dcp_proposedprojectdevelopmentdescription = dcp_projectdescriptionproposeddevelopment;
      }
    }

    return rwcdsForm;
  }

  // The syncActions method queries for project actions (dcp_projectaction) associated
  // with the rwcds form's related project. 
  // Then, it posts each of the project actions to dcp_affectedzoningresolution.
  // This occurs every time that the rwcds-form endpoint is hit
  async syncActions(projectId, rwcdsFormId, affectedZoningResolutions) {
    const { records: [currentProjectWithActions] } = await this.crmService.get(`dcp_projects`, `
      $select=dcp_projectid
      &$filter=_dcp_projectid_value eq ${projectId}
      &$expand=dcp_dcp_project_dcp_projectaction_project($filter=statuscode eq 1)
    `);

    const projectActions = currentProjectWithActions.dcp_dcp_project_dcp_projectaction_project;

    const regexFirstWord = /^(\w+)/g;

    console.log('bananas', affectedZoningResolutions[0]);

    const zrIds = affectedZoningResolutions.map(zr => zr.dcp_affectedzoningresolutionid);

    projectActions.forEach(action => !zrIds.includes(action.dcp_projectactionid) ? this.crmService.create(
      `dcp_affectedzoningresolution`, 
        {
          'dcp_zoningresolutiontype': action.dcp_name.match(regexFirstWord),
          'dcp_zrsectionnumber': action.dcp_zrsectionnumber,
          'dcp_modifiedzrsectoinnumber': action.dcp_zrmodifyingzrtxt,
          '_dcp_rwcdsform_value': rwcdsFormId,
          'dcp_affectedzoningresolutionid': action.dcp_projectactionid, 
          // how is this generated?? With the projectaction id?
          // e.g. b6d22b11-4502-ea11-b862-00155da05478
        },
      ) : console.log(`zoning resolution with id ${action.dcp_projectactionid} already exists`),
    );
  }
}
