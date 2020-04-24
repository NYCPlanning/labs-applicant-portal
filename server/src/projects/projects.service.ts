import {
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { dasherize } from 'inflected';
import { Serializer } from 'jsonapi-serializer';
import { CrmService, all, any, list, equals, subquery, lambdaFilter } from '../crm/crm.service';
import { overwriteCodesWithLabels } from '../_utils/overwrite-codes-with-labels';

const APPLICANT_ACTIVE_STATUS_CODE = 1;
const PROJECT_ACTIVE_STATE_CODE = 0;
const PROJECT_VISIBILITY_APPLICANT_ONLY = 717170002;
const PROJECT_VISIBILITY_GENERAL_PUBLIC = 717170003;

@Injectable()
export class ProjectsService {
  constructor(
    private readonly crmService: CrmService,
  ) {}

  public async findManyByContactId(contactId: string) {
    try {
      const { records } = await this.crmService.getFromObject('dcp_projects', {
        $filter: all(
          lambdaFilter('dcp_dcp_project_dcp_projectapplicant_Project', 'applicant',
            equals('applicant/_dcp_applicant_customer_value', contactId),
            equals('applicant/statuscode', APPLICANT_ACTIVE_STATUS_CODE),
          ),
          any(
            equals('dcp_visibility', PROJECT_VISIBILITY_APPLICANT_ONLY),
            equals('dcp_visibility', PROJECT_VISIBILITY_GENERAL_PUBLIC),
          ),
          equals('statecode', PROJECT_ACTIVE_STATE_CODE),
        ),
        $expand: list(
          'dcp_dcp_project_dcp_package_project',
          subquery('dcp_dcp_project_dcp_projectapplicant_Project', {
            $filter: equals('statuscode', APPLICANT_ACTIVE_STATUS_CODE),
          })
        ),
      });

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
