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

const PACKAGE_VISIBILITY = {
  APPLICANT_ONLY: 717170002,
  GENERAL_PUBLIC: 717170003,
}
const PACKAGE_STATUSCODE = {
  PACKAGE_PREPARATION: 1,
  SUBMITTED: 717170012,
  UNDER_REVIEW: 717170013,
  REVIEWED_NO_REVISIONS_REQUIRED: 717170009,
  REVIEWED_REVISION_REQUIRED: 717170010,
}

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
      const errorMessage = `Unable to find projects for current user. ${e.message}`;
      throw new HttpException({
        "code": "USER_PROJECTS_NOT_FOUND",
        "detail": errorMessage,
      }, HttpStatus.NOT_FOUND);
    }
  }

  /**
   * Gets a Project for given dcp_projectid and contactid
   *
   * @param      {string}  projectId   CRM Project dcp_projectid
   * @param      {string}  contactId   CRM Contact contactid
   * @return     {any}     { ...Project Attributes }
   */
  public async getProject(projectId: string, contactId: string) {
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
          and dcp_projectid eq '${projectId}'
        &$expand=
          dcp_dcp_project_dcp_projectapplicant_Project(
            $filter= statuscode eq ${APPLICANT_ACTIVE_STATUS_CODE}
          ),
          dcp_dcp_project_dcp_package_project(
            $filter= 
            (
              dcp_visibility eq ${PACKAGE_VISIBILITY.APPLICANT_ONLY}
              or dcp_visibility eq ${PACKAGE_VISIBILITY.GENERAL_PUBLIC}
            )
            and (
              statuscode eq ${PACKAGE_STATUSCODE.PACKAGE_PREPARATION}
              or statuscode eq ${PACKAGE_STATUSCODE.SUBMITTED}
              or statuscode eq ${PACKAGE_STATUSCODE.UNDER_REVIEW}
              or statuscode eq ${PACKAGE_STATUSCODE.REVIEWED_NO_REVISIONS_REQUIRED}
              or statuscode eq ${PACKAGE_STATUSCODE.REVIEWED_REVISION_REQUIRED}
            )
          ),
          dcp_dcp_project_dcp_projectapplicant_Project(
            $filter= statuscode eq ${APPLICANT_ACTIVE_STATUS_CODE}
          )
      `);

      const [ project ] = this.overwriteCodesWithLabels(records);
      return project;
    } catch(e) {
      const errorMessage = `Could not find requested project ${projectId}.`;
      console.log(errorMessage);
      throw new HttpException({
        "code": "PROJECT_NOT_FOUND",
        "title": "Project not found",
        "detail": errorMessage,
      }, HttpStatus.NOT_FOUND);
    }
  }

  // REDO: let's find a different approach
  private overwriteCodesWithLabels(projects) {
    return overwriteCodesWithLabels(projects, [
      '_dcp_applicant_customer_value',
    ]);
  }
}
