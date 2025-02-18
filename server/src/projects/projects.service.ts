import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { joinLabels as joinInvoiceLabels } from '../invoices/invoices.service';
import { NycidService } from '../contact/nycid/nycid.service';
import { CrmService } from '../crm/crm.service';
import { overwriteCodesWithLabels } from '../_utils/overwrite-codes-with-labels';
import { MILESTONE_ATTRS, MILESTONE_NON_DATE_ATTRS } from './projects.attrs';
import { ArtifactService } from '../artifacts/artifacts.service';

const APPLICANT_ACTIVE_STATUS_CODE = 1;
const PROJECT_ACTIVE_STATE_CODE = 0;
const PROJECT_VISIBILITY_APPLICANT_ONLY = 717170002;
const PROJECT_VISIBILITY_GENERAL_PUBLIC = 717170003;

const PACKAGE_VISIBILITY = {
  APPLICANT_ONLY: 717170002,
  GENERAL_PUBLIC: 717170003,
};
const PACKAGE_STATUSCODE = {
  PACKAGE_PREPARATION: 1,
  SUBMITTED: 717170012,
  UNDER_REVIEW: 717170013,
  REVIEWED_NO_REVISIONS_REQUIRED: 717170009,
  REVIEWED_REVISION_REQUIRED: 717170010,
};

const DCP_PROJECTROLES = {
  LEAD_PLANNER: 717170026,
  BOROUGH_TEAM_LEADER: 717170000,
};

const DCP_PROJECTINVOICE_CODES = {
  statuscode: {
    APPROVED: 2,
    PAID: 717170000,
  },

  statecode: {
    ACTIVE: 0,
    INACTIVE: 1,
  },
};

const MILESTONE_PHASES = {
  PRECERT: 717170001,
};

const DCP_MILESTONE_OWNER_TYPES = {
  DCP: 717170000,
};

@Injectable()
export class ProjectsService {
  constructor(
    private readonly crmService: CrmService,
    private readonly nycidService: NycidService,
    private readonly artifactService: ArtifactService,
  ) {}

  public async findManyByContactId(contactId: string) {
    try {
      const { records } = await this.crmService.get(
        'dcp_projects',
        `
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
      `,
      );

      return this.overwriteCodesWithLabels(records).map((project) => ({
        ...project,
        packages: project.dcp_dcp_project_dcp_package_project,
        projectApplicants: project['project-applicants'],
      }));
    } catch (e) {
      const errorMessage = `Unable to find projects for current user. ${e.message}`;
      throw new HttpException(
        {
          code: 'USER_PROJECTS_NOT_FOUND',
          detail: errorMessage,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  /**
   * Create a project, including the contact id for the primary contact and applicant
   * Lead planner is automatically assigned by CRM based on the borough
   *
   * @param body
   */
  public async create(attributes: {
    dcp_projectname: string;
    dcp_borough: string;
    dcp_applicanttype: string;
    dcp_projectbrief: string;
    _dcp_applicant_customer_value: string;
    _dcp_applicantadministrator_customer_value: string;
  }) {
    try {
      const data = {
        dcp_projectname: attributes.dcp_projectname,
        dcp_borough: attributes.dcp_borough,
        dcp_applicanttype: attributes.dcp_applicanttype,
        dcp_projectbrief: attributes.dcp_projectbrief,
        'dcp_applicant_customer_contact@odata.bind': `/contacts(${attributes._dcp_applicant_customer_value})`,
        'dcp_applicantadministrator_customer_contact@odata.bind': `/contacts(${attributes._dcp_applicantadministrator_customer_value})`,
      };

      const project = await this.crmService.create('dcp_projects', data);

      const dcpProjectId = project['dcp_projectid'];
      if (dcpProjectId === undefined) throw new Error('Failed to create project');

      const artifact =
        await this.artifactService.createProjectInitiationArtifacts(dcpProjectId);

      const dcpArtifactsId = artifact['dcp_artifactsid'];
      if (dcpArtifactsId === undefined) throw new Error('Failed to create artifact for project');

      return {
        dcp_projectid: dcpProjectId,
        dcp_artifactsid: dcpArtifactsId,
      };
    } catch (e) {
      console.error('error creating project', e);
      throw new HttpException(
        'Unable to create project',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
      const { records } = await this.crmService.get(
        'dcp_projects',
        `
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
          dcp_dcp_project_dcp_dcpprojectteam_project,
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
          dcp_dcp_project_dcp_projectmilestone_project(
            $select=${MILESTONE_ATTRS.join(',')};
            $filter=dcp_milestonephase eq ${MILESTONE_PHASES.PRECERT}
          )
      `,
      );

      const { records: projectApplicants } = await this.crmService.get(
        'dcp_projectapplicants',
        `
        $filter=
          _dcp_project_value eq ${projectId}
          and statuscode eq ${APPLICANT_ACTIVE_STATUS_CODE}
        &$expand=
          dcp_applicant_customer_contact
      `,
      );

      const { records: projectTeamMembers } = await this.crmService.get(
        'dcp_dcpprojectteams',
        `
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
      `,
      );

      const { records: dcpOwnedMilestones } = await this.crmService.get(
        'dcp_milestones',
        `
            $select=dcp_milestoneid
            &$filter=dcp_milestoneownertype eq ${DCP_MILESTONE_OWNER_TYPES.DCP}
      `,
      );

      const { records: projectPackages } = await this.crmService.get(
        'dcp_packages',
        `
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
        &$expand=dcp_dcp_package_dcp_projectinvoice_package(
          $filter=statuscode eq ${DCP_PROJECTINVOICE_CODES.statuscode.APPROVED}
            or statuscode eq ${DCP_PROJECTINVOICE_CODES.statuscode.PAID}
        )
      `,
      );

      const projectApplicantsWithContacts = await Promise.all(
        projectApplicants.map(async (applicant) => {
          const contact = applicant.dcp_applicant_customer_contact || {};
          let is_nycid_email_registered;

          // If there's already a nycid GUID, they've already logged in, so their e-mail is registered.
          if (contact.dcp_nycid_guid) {
            is_nycid_email_registered = true;
          } else {
            ({ is_nycid_email_registered } =
              await this.nycidService.isNycidEmailRegistered(
                contact.emailaddress1,
              ));
          }

          return {
            ...applicant,
            contact: {
              ...contact,
              is_nycid_email_registered,
            },
          };
        }),
      );

      const [project] = this.overwriteCodesWithLabels(records);

      if (!project) {
        const errorMessage = `Could not find requested project ${projectId}.`;
        console.log(errorMessage);

        throw new HttpException(
          {
            code: 'PROJECT_NOT_FOUND',
            title: 'Project not found',
            detail: errorMessage,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const projectMilestones =
        project.dcp_dcp_project_dcp_projectmilestone_project.map(
          (projectMilestone) => ({
            is_dcp_owned: !!dcpOwnedMilestones.find(
              (milestone) =>
                milestone.dcp_milestoneid ===
                projectMilestone._dcp_milestone_value,
            ),

            ...projectMilestone,
          }),
        );

      // we use MILESTONE_NON_DATE_ATTRS because if we include dates when we reformat below,
      // then the dates end up being sent to the frontend as strings, so we exclude them here
      const formattedProjectMilestones = overwriteCodesWithLabels(
        projectMilestones,
        [...MILESTONE_NON_DATE_ATTRS],
      );

      return {
        ...project,
        packages: projectPackages.map((pkg) => ({
          ...pkg,
          invoices: joinInvoiceLabels(
            pkg.dcp_dcp_package_dcp_projectinvoice_package,
          ),

          // NOTE: "virtual" property. Maybe not be available in other requests for pkg data!
          grand_total: pkg.dcp_dcp_package_dcp_projectinvoice_package.reduce(
            (acc, curr) => curr.dcp_grandtotal + acc,
            0,
          ),
        })),
        projectApplicants: project['project-applicants'],
        'project-applicants': projectApplicantsWithContacts,
        'team-members': projectTeamMembers.map((member) => ({
          dcp_dcpprojectteamid: member.dcp_dcpprojectteamid,
          name: member.dcp_name,
          role: member[
            'dcp_projectrole@OData.Community.Display.V1.FormattedValue'
          ],
          email: member.dcp_user.internalemailaddress,
          phone: member.dcp_user.address1_telephone1,
        })),
        milestones: formattedProjectMilestones,
      };
    } catch (e) {
      console.log(e);

      throw new HttpException(
        {
          code: 'PROJECTS_SERVICE_FAILURE',
          title: 'Could not lookup projects. Something went wrong.',
          detail: e,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // REDO: let's find a different approach
  private overwriteCodesWithLabels(projects) {
    return overwriteCodesWithLabels(projects, [
      '_dcp_applicant_customer_value',
    ]);
  }
}
