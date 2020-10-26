import {
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { NycidService } from '../contact/nycid/nycid.service';
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

const DCP_PROJECTROLES = {
  LEAD_PLANNER: 717170026,
  BOROUGH_TEAM_LEADER: 717170000,
};

@Injectable()
export class ProjectsService {
  constructor(
    private readonly crmService: CrmService,
    private readonly nycidService: NycidService,
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
  public async getProject(projectId: string) {
    try {
      const { records } = await this.crmService.get('dcp_projects', `
        $filter=
          dcp_dcp_project_dcp_projectapplicant_Project/
            any(o:
              o/statuscode eq ${APPLICANT_ACTIVE_STATUS_CODE}
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
          dcp_dcp_project_dcp_dcpprojectteam_project
      `);

      const { records: projectApplicants } = await this.crmService.get('dcp_projectapplicants', `
        $filter=
          _dcp_project_value eq ${projectId}
          and statuscode eq ${APPLICANT_ACTIVE_STATUS_CODE}
        &$expand=
          dcp_applicant_customer_contact
      `);

      const { records: projectTeamMembers } = await this.crmService.get('dcp_dcpprojectteams', `
        $select=
          dcp_projectrole,
          dcp_name
        &$filter=
          _dcp_project_value eq ${projectId}
          and (
            dcp_projectrole eq ${DCP_PROJECTROLES.BOROUGH_TEAM_LEADER}
            or dcp_projectrole eq ${DCP_PROJECTROLES.LEAD_PLANNER}
          )
        &$expand=
          dcp_user(
            $select=internalemailaddress,address1_telephone1
          )
        &$orderby=dcp_name asc
      `);

      const { records: projectPackages } = await this.crmService.get('dcp_packages', `
        $filter=
          _dcp_project_value eq ${projectId}
          and (
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
        &$expand=dcp_dcp_package_dcp_projectinvoice_package
      `);

      const projectApplicantsWithContacts = await Promise.all(projectApplicants.map(async applicant => {
        const contact = applicant.dcp_applicant_customer_contact;
        let is_nycid_email_registered;

        // If there's already a nycid GUID, they've already logged in, so their e-mail is registered.
        if (contact.dcp_nycid_guid) {
          is_nycid_email_registered = true;
        } else {
          ({ is_nycid_email_registered } = await this.nycidService.isNycidEmailRegistered(contact.emailaddress1));
        }

        return {
          ...applicant,
          contact: {
            ...contact,
            is_nycid_email_registered,
          },
        }
      }));

      const [ project ] = this.overwriteCodesWithLabels(records);

      if (!project) {
        const errorMessage = `Could not find requested project ${projectId}.`;
        console.log(errorMessage);

        throw new HttpException({
          "code": "PROJECT_NOT_FOUND",
          "title": "Project not found",
          "detail": errorMessage,
        }, HttpStatus.NOT_FOUND);
      }

      return {
        ...project,
        packages: projectPackages.map(pkg => ({
          ...pkg,
          invoices: pkg.dcp_dcp_package_dcp_projectinvoice_package,
        })),
        projectApplicants: project['project-applicants'],
        'project-applicants': projectApplicantsWithContacts,
        'team-members': projectTeamMembers.map(member => ({
          dcp_dcpprojectteamid: member.dcp_dcpprojectteamid,
          name: member.dcp_name,
          role: member['dcp_projectrole@OData.Community.Display.V1.FormattedValue'],
          email: member.dcp_user.internalemailaddress,
          phone: member.dcp_user.address1_telephone1,
        })),
      };
    } catch(e) {
      console.log(e);

      throw new HttpException({
        "code": "PROJECTS_SERVICE_FAILURE",
        "title": "Could not lookup projects. Something went wrong.",
        "detail": e,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // REDO: let's find a different approach
  private overwriteCodesWithLabels(projects) {
    return overwriteCodesWithLabels(projects, [
      '_dcp_applicant_customer_value',
    ]);
  }
}
