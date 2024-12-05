import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
import { CrmService } from 'src/crm/crm.service';

@Injectable()
export class ProjectAccessGuard implements CanActivate {
  constructor(
    private readonly crmService: CrmService,
    private readonly config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const {
      params: { id: projectId },
      session: { contactId, mail },
    } = context.switchToHttp().getRequest();

    // permit internal staff to access
    if (
      mail?.endsWith('@planning.nyc.gov') ||
      (this.config.featureFlag.creeper && mail === 'dcpcreeper@gmail.com')
    ) {
      return true;
    }

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
  }
}
