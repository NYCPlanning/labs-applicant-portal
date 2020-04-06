import { 
  Controller, 
  Get, 
  Query,
  Res,
  HttpException,
  HttpStatus,
  Session,
} from '@nestjs/common';
import { Response } from 'express';
import { Serializer } from 'jsonapi-serializer';
import { dasherize } from 'inflected';
import { ProjectsService } from './projects.service';
import { ConfigService } from '../config/config.service';
import { ContactService } from '../contact/contact.service';
import { AuthService } from '../auth/auth.service';

@Controller()
export class ProjectsController {
  CRM_IMPOSTER_ID = '';

  constructor(
    private readonly projectsService: ProjectsService,
    private readonly contactService: ContactService,
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {
    this.CRM_IMPOSTER_ID = this.config.get('CRM_IMPOSTER_ID');
  }

  @Get('/projects')
  async listOfCurrentUserProjects(@Session() session) {
    if (!session) throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    
    let { contactId } = session;

    try {
      if (contactId) {
        const currentUserListOfProjects = await this.projectsService.findManyByContactId(contactId);

        return this.serialize(currentUserListOfProjects);
      }
    } catch (e) {
      const errorMessage = `${e}`;
      console.log(errorMessage);
      throw new HttpException(errorMessage, HttpStatus.UNAUTHORIZED);
    }
  }

  // Serializes an array of objects into a JSON:API document
  serialize(records, opts?: object): Serializer {

    const ProjectsSerializer = new Serializer('projects', {
      attributes: ['dcp_projectname', 'dcp_name', 'statecode', 'dcp_visibility', '_dcp_applicantadministrator_customer_value', 'dcp_dcp_project_dcp_projectapplicant_Project', 'dcp_dcp_project_dcp_package_project'],
      id: 'dcp_projectid',
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
