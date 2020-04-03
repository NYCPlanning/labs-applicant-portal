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

    try  {
      results = await this.crmService.get(`dcp_projects?$filter=%20dcp_dcp_project_dcp_projectapplicant_Project/%20any(o:o/_dcp_applicant_customer_value%20eq%20%20%27${contactId}%27)%20&$expand=%20dcp_dcp_project_dcp_package_project,%20dcp_dcp_project_dcp_projectapplicant_Project`);
    } catch(e) {
      const errorMessage = `Error finding projects by contact ID. ${e.message}`;
      console.log(errorMessage);
      throw new HttpException(errorMessage, HttpStatus.UNAUTHORIZED);
    }

    const firstResult = results['value'][0];

    return firstResult;
  }

}
