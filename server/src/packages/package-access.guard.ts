import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable
} from '@nestjs/common';
import {
  CrmService
} from '../crm/crm.service';

const APPLICANT_ACTIVE_STATUS_CODE = 1;
const PROJECT_ACTIVE_STATE_CODE = 0;
const PROJECT_VISIBILITY_APPLICANT_ONLY = 717170002;
const PROJECT_VISIBILITY_GENERAL_PUBLIC = 717170003;

// This guard makes sure that only
// authenticated users who are part of the requested
// package's project applicant team can access the package
@Injectable()
export class PackageAccessGuard implements CanActivate {
  constructor(
    private readonly crmService: CrmService,
  ) {}

  async canActivate(
    context: ExecutionContext
  ): Promise<boolean> {
    const {
      params: {
        id: packageId,
      },
      session: {
        contactId,
        isCreeper = false,
      }
    } = context.switchToHttp().getRequest();

    // because creeper mode allows authorization on all resources, skip this layer
    if (isCreeper) {
      return true;
    }

    // note that this could return either true or false — false would
    // trigger the default Nest HTTP exception
    if (contactId) {
      return this.isOnApplicantTeam(packageId, contactId);
    }

    // If for some reason, there is no contact ID, it will throw this exception, which is
    // incorrect — implicitly, no contact ID means it's unauthenticated, not unauthorized
    throw new HttpException({
      code: "NO_PACKAGE_ACCESS",
      title: "No access to package",
      detail: "Access to the requested package is forbidden."
    }, HttpStatus.FORBIDDEN);
  }

  async isOnApplicantTeam(packageId, contactId) {
    const { records } = await this.crmService.get('dcp_projects', `
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
      `);

    if (records.length > 0) {
      return true;
    }

    return false;
  }
}
