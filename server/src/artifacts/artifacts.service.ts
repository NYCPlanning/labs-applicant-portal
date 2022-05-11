import {
  Injectable,
} from '@nestjs/common';

import { CrmService } from '../crm/crm.service';


@Injectable()
export class ArtifactService {
  constructor(
    private readonly crmService: CrmService,
  ) {}

  public async createEquityReport(projectId: string) {
    let newArtifact = null;

    try {
      newArtifact = this.crmService.create('dcp_artifactses', {
        dcp_name: `Racial Equity Report`,
        dcp_isdcpinternal: false,
        dcp_filecreator: 717170000, // Applicant
        dcp_filecategory: 717170006, // Other
        'dcp_applicantfiletype@odata.bind': "/dcp_filetypes(8e49a11b-0991-ec11-8d20-001dd804c26c)",
        ...(projectId ? {  'dcp_project@odata.bind': `/dcp_projects(${projectId})` } : {})
      });
    } catch (e) {
      console.log(e);
    }

    return newArtifact;
  }
}
