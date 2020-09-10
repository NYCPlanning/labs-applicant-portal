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
import { PROJECTAPPLICANT_ATTRS } from './project-applicants/project-applicants.attrs';
import { TEAMMEMBER_ATTRS } from './team-members/team-members.attrs';
import { CONTACT_ATTRS } from '../contact/contacts.attrs';

@UseInterceptors(new JsonApiSerializeInterceptor('projects', {
  id: 'dcp_projectid',
  attributes: [
    ...PROJECT_ATTRS,

    'packages',
    'project-applicants',
    'team-members',
    'contacts',
  ],
  packages: {
    ref: 'dcp_packageid',
    attributes: [
      ...PACKAGE_ATTRS,
    ],
  },
  'project-applicants': {
    ref: 'dcp_projectapplicantid',
    attributes: [
      ...PROJECTAPPLICANT_ATTRS,

      'contact'
    ],
    contact: {
      ref: 'contactid',
      attributes: [
        ...CONTACT_ATTRS,
      ],
    },
  },
  'team-members': {
    ref: 'dcp_dcpprojectteamid',
    attributes: [
      ...TEAMMEMBER_ATTRS,
    ],
  },

  // remap verbose navigation link names to
  // more concise names
  transform(project) {
    try {
      return {
        ...project,
        packages: project.dcp_dcp_project_dcp_package_project,
        projectApplicants: project['project-applicants'],
      };
    } catch(e) {
      if (e instanceof HttpException) {
        throw e;
      } else {
        throw new HttpException({
          code: 'PROJECTS_ERROR',
          title: 'Failed load project(s)',
          detail: `An error occurred while loading one or more projects. ${e.message}`,
        }, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
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
  async listOfCurrentUserProjects(@Session() session) {
    const { contactId } = session;

    try {
      if (contactId) {
        return await this.projectsService.findManyByContactId(contactId);
      }
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      } else {
        throw new HttpException({
          code: 'FIND_USER_PROJECTS_FAILED',
          title: 'Failed getting projects',
          detail: `An unknown server error occured while getting projects. ${e.message}`,
        }, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @Get('/projects/:id')
  async projectById(@Param('id') id) {
    try {
      return await this.projectsService.getProject(id);
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      } else {
        throw new HttpException({
          code: 'FIND_PROJECT_FAILED',
          title: 'Failed getting a project',
          detail: `An unknown server error occured while finding a project by ID. ${e.message}`,
        }, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
}
