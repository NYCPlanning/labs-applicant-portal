import {
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CrmService } from '../crm/crm.service';
import { overwriteCodesWithLabels } from '../_utils/overwrite-codes-with-labels';

const APPLICANT_ACTIVE_STATUS_CODE = 1;
const PROJECT_ACTIVE_STATE_CODE = 0;
const PROJECT_VISIBILITY_APPLICANT_ONLY = 717170002;
const PROJECT_VISIBILITY_GENERAL_PUBLIC = 717170003;

@Injectable()
export class ProjectsService {
  constructor(
    private readonly crmService: CrmService,
  ) {}

  public async findManyByContactId(contactId: string) {
    try {
      const { records } = await this.crmService.get('dcp_projects', `
        $filter=
          dcp_dcp_project_dcp_projectapplicant_Project/
            any(o:
              o/_dcp_applicant_customer_value eq '${contactId}'
              and o/statuscode eq ${APPLICANT_ACTIVE_STATUS_CODE}
            ) 
          and (
            dcp_visibility eq ${PROJECT_VISIBILITY_APPLICANT_ONLY}
            or dcp_visibility eq ${PROJECT_VISIBILITY_GENERAL_PUBLIC}
          )
          and statecode eq ${PROJECT_ACTIVE_STATE_CODE}
        &$expand=
          dcp_dcp_project_dcp_package_project,
          dcp_dcp_project_dcp_projectapplicant_Project(
            $filter= statuscode eq ${APPLICANT_ACTIVE_STATUS_CODE}
          )
      `);
   
      return this.overwriteCodesWithLabels(records);
    } catch(e) {
      const errorMessage = `Error finding projects by contact ID. ${e.message}`;
      console.log(errorMessage);
      throw new HttpException(errorMessage, HttpStatus.UNAUTHORIZED);
    }
  }

  private overwriteCodesWithLabels(projects) {
    return overwriteCodesWithLabels(projects, [
      'statuscode',
      '_dcp_applicant_customer_value',
      'dcp_packagetype',
    ]);
  }
}
