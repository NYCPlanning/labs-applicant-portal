import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
  Session,
  UseInterceptors,
  UseGuards,
  Param,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ConfigService } from '../config/config.service';
import { ContactService } from '../contact/contact.service';
import { JsonApiSerializeInterceptor } from '../json-api-serialize.interceptor';
import { AuthenticateGuard } from '../authenticate.guard';
import { PROJECT_ATTRS } from './projects.attrs';
import { PACKAGE_ATTRS } from '../packages/packages.attrs';

@UseInterceptors(new JsonApiSerializeInterceptor('projects', {
  id: 'dcp_projectid',
  attributes: [
    ...PROJECT_ATTRS,

    'packages',
  ],
  packages: {
    ref: 'dcp_packageid',
    attributes: [
      ...PACKAGE_ATTRS,
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
@UseGuards(AuthenticateGuard)
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

  @Get('/projects/:id')
  async projectById(@Session() session, @Param('id') id, @Query('email') email) {
    let { contactId } = session;

    if (email) {
      ({ contactid: contactId } = await this.contactService.findOneByEmail(
        email,
      ));
    }

    try {
      if (contactId) {
        return this.projectsService.getProject(id, contactId);
      }
    } catch (e) {
      const errorMessage = `${e}`;

      throw new HttpException({
        "code": "GET_PROJECT_CONTROLLER_ERROR",
        "message": errorMessage,
      }, HttpStatus.BAD_REQUEST);
    }
  }
}
