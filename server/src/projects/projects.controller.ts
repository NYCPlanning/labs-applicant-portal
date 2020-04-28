import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
  Session,
  UseInterceptors,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ConfigService } from '../config/config.service';
import { ContactService } from '../contact/contact.service';
import { JsonApiSerializeInterceptor } from '../json-api-serialize.interceptor';

@UseInterceptors(new JsonApiSerializeInterceptor('projects', {
  id: 'dcp_name',
  attributes: [
    'dcp_projectname',
    'dcp_name',
    'statecode',
    'statuscode',
    'dcp_visibility',
    '_dcp_applicant_customer_value',
    'dcp_dcp_project_dcp_projectapplicant_Project',
    'packages',
  ],
  packages: {
    ref: 'dcp_packageid',
    attributes: [
      'statuscode',
      'dcp_packagetype',
      'dcp_visibility',
    ],
  },

  // remap verbose navigation link names to
  // more concise names
  transform(project) {
    return {
      ...project,
      packages: project.dcp_dcp_project_dcp_package_project,
    };
  },
}))
@Controller()
export class ProjectsController {
  CRM_IMPOSTER_ID = '';

  constructor(
    private readonly projectsService: ProjectsService,
    private readonly contactService: ContactService,
    private readonly config: ConfigService,
  ) {
    this.CRM_IMPOSTER_ID = this.config.get('CRM_IMPOSTER_ID');
  }

  @Get('/projects')
  async listOfCurrentUserProjects(@Session() session, @Query('email') email) {
    let { contactId } = session;

    // TODO: Use a NestJS interceptor object or something to help with this
    if (!contactId)
      throw new HttpException(
        'Unauthorized. Please login.',
        HttpStatus.UNAUTHORIZED,
      );

    if (email) {
      ({ contactid: contactId } = await this.contactService.findOneByEmail(
        email,
      ));
    }

    try {
      if (contactId) {
        return this.projectsService.findManyByContactId(contactId);
      }
    } catch (e) {
      const errorMessage = `${e}`;

      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }
  }
}
