import {
  Injectable,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { CrmService } from '../../crm/crm.service';
import { LANDUSE_FORM_ATTRS } from './landuse-form.attrs';
import { LANDUSE_ACTION_ATTRS } from './landuse-actions/landuse-actions.attrs';
import { ApplicantsController } from '../pas-form/applicants/applicants.controller';

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

    landuseForm.landuseActions = landuseActionsWithZr;

    console.log('ice cream', landuseForm);

    // await this.syncApplicants(landuseForm, 'dcp_dcp_applicantinformation_dcp_landuse');
    // await this.syncApplicants(landuseForm, 'dcp_dcp_applicantrepinformation_dcp_landuse');

    return {
      ...landuseForm,
      ...landuseFormPg2,
    };
  }

  // async syncApplicants(landuseForm, targetEntity) {
  //   const {
  //     dcp_dcp_applicantinformation_dcp_landuse,
  //     dcp_dcp_applicantrepinformation_dcp_landuse,
  //     dcp_landuseid,
  //     _dcp_project_value,
  //   } = landuseForm;

    // console.log('mango', _dcp_project_value);
    
    // const pancakes = await this.crmService.get('dcp_pasforms', `
    //   $filter=
    //   _dcp_projectname_value eq '2785E1E07D-C022-EB11-A813-001DD8309F0E'
    // `);

    // console.log('pancakes', pancakes);

    // const landuseApplicants = [...dcp_dcp_applicantinformation_dcp_landuse, ...dcp_dcp_applicantrepinformation_dcp_landuse];
    // const pasApplicants = [...pasFormWithApplicants.dcp_dcp_applicantinformation_dcp_pasform, ...pasFormWithApplicants.dcp_dcp_applicantrepinformation_dcp_pasform];
  
    // await Promise.all(pasApplicants.map(pasApplicant => {
    //   const pasApplicantEmail = pasApplicant.dcp_email;
    //   console.log('pasApplicantEmail', pasApplicantEmail);

    //   const landuseApplicantEmails = landuseApplicants.map(applicant => applicant.dcp_email);
    //   console.log('landuseApplicantEmail', landuseApplicantEmails);

    //   // const updatedAttributes = {
    //   //   'dcp_firstname': pasApplicant.dcp_firstname,
    //   //   'dcp_lastname': pasApplicant.dcp_lastname,
    //   //   'dcp_organization': pasApplicant.dcp_organization,
    //   //   'dcp_email': pasApplicant.dcp_email,
    //   //   'dcp_address': pasApplicant.dcp_address,
    //   //   'dcp_city': pasApplicant.dcp_city,
    //   //   'dcp_state': pasApplicant.dcp_state,
    //   //   'dcp_zipcode': pasApplicant.dcp_zipcode,
    //   //   'dcp_phone': pasApplicant.dcp_phone,

    //   // };

    //   // if (pasApplicant.dcp_type) {
    //   //   updatedAttributes['dcp_type'] = pasApplicant.dcp_type;
    //   // } 

    //   if (!landuseApplicantEmails.includes(pasApplicantEmail)) {
    //     console.log('are we running the right function?');
    //     this.crmService.update(targetEntity, pasApplicant.id, {
    //       'dcp_dcp_applicantrepinformation_dcp_landuse@odata.bind': [
    //         `/dcp_landuses(${dcp_landuseid})`,
    //       ],
    //     });
    //   }
    // }));
  // }
}
