import {
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CrmService } from '../crm/crm.service';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly crmService: CrmService,
  ) {
  }

  public async findManyByContactId(contactId: string) {
    let results = null;

    const activeStatusCode = '0';
    const activeStateCode = '0';
    const packageVisibilityApplicantOnly = '717170002';
    const packageVisibilityGeneralPublic = '717170002';
    const projectVisibilityApplicantOnly = '717170003';
    const projectVisibilityGeneralPublic = '717170003';

    try  {
      results = await this.crmService.get(`dcp_projects?$filter=dcp_dcp_project_dcp_projectapplicant_Project/any(o:o/_dcp_applicant_customer_value%20eq%20%27${contactId}%27)%20and%20(dcp_visibility%20eq%20${projectVisibilityApplicantOnly}%20or%20dcp_visibility%20eq%20${projectVisibilityGeneralPublic})&$expand=dcp_dcp_project_dcp_package_project($filter=%20statecode%20eq%20${activeStatusCode}%20and%20(dcp_visibility%20eq%20${packageVisibilityApplicantOnly}%20or%20dcp_visibility%20eq%20${packageVisibilityGeneralPublic})),dcp_dcp_project_dcp_projectapplicant_Project($filter=%20statecode%20eq%20${activeStateCode})`);
    } catch(e) {
      const errorMessage = `Error finding projects by contact ID. ${e.message}`;
      console.log(errorMessage);
      throw new HttpException(errorMessage, HttpStatus.UNAUTHORIZED);
    }

    return results['value'];
  }

}