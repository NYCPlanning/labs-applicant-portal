import {
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { dasherize } from 'inflected';
import { Serializer } from 'jsonapi-serializer';
import { CrmService } from '../crm/crm.service';
import { overwriteCodesWithLabels } from '../_utils/overwrite-codes-with-labels';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly crmService: CrmService,
  ) {
  }

  public async findManyByContactId(contactId: string) {
    const applicantActiveStatusCode = '1';
    const projectActiveStateCode = '0';
    const projectVisibilityApplicantOnly = '717170002';
    const projectVisibilityGeneralPublic = '717170003';

    // Todo: Migrate this query to use oData service and write tests for this 
    try  {
      const { records } = await this.crmService.get('dcp_projects', `$filter=dcp_dcp_project_dcp_projectapplicant_Project/any(o:o/_dcp_applicant_customer_value%20eq%20%27${contactId}%27%20and%20o/statuscode%20eq%20${applicantActiveStatusCode})%20and%20(dcp_visibility%20eq%20${projectVisibilityApplicantOnly}%20or%20dcp_visibility%20eq%20${projectVisibilityGeneralPublic})%20and%20statecode%20eq%20${projectActiveStateCode}&$expand=dcp_dcp_project_dcp_package_project,dcp_dcp_project_dcp_projectapplicant_Project($filter=%20statuscode%20eq%20${applicantActiveStatusCode})`);

      return this.serialize(
        this.overwriteCodesWithLabels(records),
      );
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

  // Serializes an array of objects into a JSON:API document
  private serialize(records, opts?: object): Serializer {
    const ProjectsSerializer = new Serializer('projects', {
      attributes: [
        'dcp_projectname',
        'dcp_name',
        'statecode',
        'statuscode',
        'dcp_visibility',
        '_dcp_applicant_customer_value',
        'dcp_dcp_project_dcp_projectapplicant_Project',
        'dcp_dcp_project_dcp_package_project',
      ],
      id: 'dcp_name',
      meta: { ...opts },
      keyForAttribute(key) {
        let dasherized = dasherize(key);

        if (dasherized[0] === '-') {
          dasherized = dasherized.substring(1);
        }

        return dasherized;
      },
    });

    return ProjectsSerializer.serialize(records);
  }
}
