import {
  Injectable,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { CrmService } from '../../crm/crm.service';
import { LANDUSE_FORM_ATTRS } from './landuse-form.attrs';
import { LANDUSE_ACTION_ATTRS } from './landuse-actions/landuse-actions.attrs';

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
        dcp_dcp_landuse_dcp_relatedactions
    `);

    // We make a second request to accommodate additional hasMany expands.
    // A CRM get can only have max of 5 expands.
    const { records: [landuseFormPg2] } = await this.crmService.get('dcp_landuses', `
      $filter=
        dcp_landuseid eq ${id}
      &$expand=
        dcp_dcp_landuse_dcp_sitedatahform_landuseform,
        dcp_dcp_landuse_dcp_landusegeography_landuseform,
        dcp_leadagency,
        dcp_dcp_landuse_dcp_affectedzoningresolution_Landuseform,
        dcp_dcp_landuse_dcp_zoningmapchanges_LandUseForm,
    `);

    const { records: landuseActionsWithZr } = await this.crmService.get(`dcp_landuseactions`, `
      $select=${LANDUSE_ACTION_ATTRS.join(',')},
      dcp_dateofpreviousapproval,
      dcp_lapsedateofpreviousapproval,
      dcp_recordationdate,
      &$filter=
        _dcp_landuseid_value eq ${id}
      &$expand=
        dcp_zoningresolutionsectionactionispursuantto
    `);

    await this.syncApplicants(landuseForm);

    landuseForm.landuseActions = landuseActionsWithZr;
    return {
      ...landuseForm,
      ...landuseFormPg2,
    };
  }

  async syncApplicants(landuseForm) {
    const {
      dcp_dcp_applicantinformation_dcp_landuse,
      dcp_dcp_applicantrepinformation_dcp_landuse,
      dcp_landuseid,
      _dcp_project_value,
    } = landuseForm;

    const { records: [pasFormWithApplicants] } = await this.crmService.get('dcp_pasforms', `
      $filter=
        _dcp_projectname_value eq ${_dcp_project_value}
      &$expand=
      dcp_dcp_applicantinformation_dcp_pasform,
      dcp_dcp_applicantrepinformation_dcp_pasform,
    `);

    const landuseApplicants = [...dcp_dcp_applicantinformation_dcp_landuse, ...dcp_dcp_applicantrepinformation_dcp_landuse];
    const pasApplicants = [...pasFormWithApplicants.dcp_dcp_applicantinformation_dcp_pasform, ...pasFormWithApplicants.dcp_dcp_applicantrepinformation_dcp_pasform];

    const landuseApplicantEmails = landuseApplicants.map(applicant => applicant.dcp_email);

    await Promise.all(pasApplicants.map(pasApplicant => {
      if (!landuseApplicantEmails.includes(pasApplicant.dcp_email)) {
        if (pasApplicant.dcp_applicantinformationid) {
    
          this.crmService.update(
            'dcp_applicantinformations',
            pasApplicant.dcp_applicantinformationid, {
              'dcp_dcp_applicantinformation_dcp_landuse@odata.bind': [
                `/dcp_landuses(${dcp_landuseid})`,
              ],
            }
          );
        } else if (pasApplicant.dcp_applicantrepresentativeinformationid) {
    
          // strip the hacky prepended "representative-" to use the exact CRM id
          // const representativeId = pasApplicant.dcp_applicantinformationid.replace('representative-', '');
    
          // this.crmService.update(
          //   'dcp_applicantrepresentativeinformations',
          //   pasApplicant.dcp_applicantinformationid, {
          //     'dcp_dcp_applicantrepinformation_dcp_landuse@odata.bind': [
          //       `/dcp_landuses(${dcp_landuseid})`,
          //     ],
          //   }
          // )
        }
      }
    }));
  }
}
