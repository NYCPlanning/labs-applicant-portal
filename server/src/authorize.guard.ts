import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from 'src/config/config.service';
import { CrmService } from 'src/crm/crm.service';
import { Relationship } from 'src/relationships.decorator';

const APPLICANT_ACTIVE_STATUS_CODE = 1;
const PROJECT_ACTIVE_STATE_CODE = 0;
const PROJECT_VISIBILITY_APPLICANT_ONLY = 717170002;
const PROJECT_VISIBILITY_GENERAL_PUBLIC = 717170003;

@Injectable()
export class AuthorizeGuard implements CanActivate {
  constructor(
    private readonly crmService: CrmService,
    private readonly config: ConfigService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const {
      params: { projectId, packageId, projectApplicantId },
      session: { contactId, mail, creeperTargetEmail },
      body,
    } = context.switchToHttp().getRequest() as {
      params: {
        projectId: string | undefined;
        packageId: string | undefined;
        projectApplicantId: string | undefined;
      };
      session: {
        contactId: string;
        mail: string;
        creeperTargetEmail: string | null | undefined;
      };
      body: any
    };

    const relationships: Array<Relationship> =
      this.reflector.get('relationships', context.getHandler()) ?? [];

    console.debug('body', body);
    console.debug('creeperTargetEmail', creeperTargetEmail);
    console.debug('projectId', projectId);
    console.debug('packageId', packageId);
    console.debug('projectApplicantId', projectApplicantId);
    console.debug('mail', mail);
    console.debug('contactId', contactId);

    return (
      this.withHelper(relationships, creeperTargetEmail, mail) ||
      this.withSelf(relationships, creeperTargetEmail) ||
      (await this.withApplicantTeam(
        contactId,
        packageId,
        projectId,
        projectApplicantId,
        relationships,
      ))
    );
  }

  withHelper(
    relationships: Array<Relationship>,
    creeperTargetEmail: string | null | undefined,
    mail: string,
  ) {
    if (!this.config.featureFlag.creeper) return false;
    if (!relationships.includes('helper')) return false;
    if (creeperTargetEmail === null || creeperTargetEmail === undefined)
      return false;
    if (mail === 'dcpcreeper@gmail.com') return true;
    return false;
  }

  withSelf(
    relationships: Array<Relationship>,
    creeperTargetEmail: string | null | undefined,
  ) {
    if (!relationships.includes('self')) return false;
    if (creeperTargetEmail === null || creeperTargetEmail === undefined)
      return true;
    return false;
  }

  withApplicantTeam(
    contactId: string,
    packageId: string | undefined,
    projectId: string | undefined,
    projectApplicantId: string | undefined,
    relationships: Array<Relationship>,
  ) {
    if (!relationships.includes('applicant-team')) return false;
    if (projectId !== undefined) {
      return this.checkByProjectId(contactId, projectId);
    } else if (packageId !== undefined) {
      return this.checkByPackageId(contactId, packageId);
    } else if (projectApplicantId !== undefined) {
      console.debug('checking by project applicant id', projectApplicantId);
      return this.checkByProjectApplicantId(contactId, projectApplicantId);
    } else {
      return false;
    }
  }

  async checkByProjectApplicantId(
    contactId: string,
    projectApplicantId: string,
  ) {
    try {
      const { records } = await this.crmService.get(
        'dcp_projects',
        `
              $filter=
                dcp_dcp_project_dcp_projectapplicant_Project/
                  any(o:
                    o/dcp_projectapplicantid eq '${projectApplicantId}'
                  )
                and dcp_dcp_project_dcp_projectapplicant_Project/
                  any(o:
                    o/_dcp_applicant_customer_value eq '${contactId}'
                  )
            `,
      );
      return records.length > 0;
    } catch (e) {
      console.error('failed to find project applicant', e);
      throw new HttpException(
        'Could not find project applicant',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async checkByProjectId(contactId: string, projectId: string) {
    try {
      const { records } = await this.crmService.get(
        'dcp_projects',
        `
              $filter=
                dcp_dcp_project_dcp_projectapplicant_Project/
                  any(o:
                    o/_dcp_applicant_customer_value eq '${contactId}'
                  )
                and dcp_projectid eq '${projectId}'
            `,
      );

      return records.length > 0;
    } catch (e) {
      console.error('failed to find project for user', e);
      throw new HttpException(
        'Could not find project',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async checkByPackageId(contactId: string, packageId: string) {
    try {
      const { records } = await this.crmService.get(
        'dcp_projects',
        `
          $filter=
            dcp_dcp_project_dcp_package_project/
              any(o:
                o/dcp_packageid eq '${packageId}'
              )
            and
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
          `,
      );

      return records.length > 0;
    } catch (e) {
      console.error('cannot verify package or contact', e);
      throw new HttpException(
        'Cannot find package',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
