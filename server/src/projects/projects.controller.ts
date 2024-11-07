import {
  Controller,
  Get,
  Patch,
  Body,
  HttpException,
  HttpStatus,
  Session,
  UseInterceptors,
  UseGuards,
  UsePipes,
  Param,
  Post,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ConfigService } from '../config/config.service';
import { ContactService } from '../contact/contact.service';
import { CrmService } from '../crm/crm.service';
import { JsonApiSerializeInterceptor } from '../json-api-serialize.interceptor';
import { AuthenticateGuard } from '../authenticate.guard';
import { JsonApiDeserializePipe } from '../json-api-deserialize.pipe';
import { pick } from 'underscore';
import { MILESTONE_ATTRS, PROJECT_ATTRS } from './projects.attrs';
import { PACKAGE_ATTRS } from '../packages/packages.attrs';
import { PROJECTAPPLICANT_ATTRS } from './project-applicants/project-applicants.attrs';
import { TEAMMEMBER_ATTRS } from './team-members/team-members.attrs';
import { CONTACT_ATTRS } from '../contact/contacts.attrs';
import { INVOICE_ATTRS } from '../invoices/invoices.attrs';

@UseInterceptors(
  new JsonApiSerializeInterceptor('projects', {
    id: 'dcp_projectid',
    attributes: [
      ...PROJECT_ATTRS,

      'packages',
      'project-applicants',
      'team-members',
      'contacts',
      'milestones',
    ],
    packages: {
      ref: 'dcp_packageid',
      attributes: [
        ...PACKAGE_ATTRS,

        // Virtual property — computed in the projects service
        'grand_total',

        'invoices',
      ],
      invoices: {
        ref: 'dcp_projectinvoiceid',
        attributes: [...INVOICE_ATTRS],
      },
    },
    'project-applicants': {
      ref: 'dcp_projectapplicantid',
      attributes: [...PROJECTAPPLICANT_ATTRS, 'contact'],
      contact: {
        ref: 'contactid',
        attributes: [...CONTACT_ATTRS, 'is_nycid_email_registered'],
      },
    },
    'team-members': {
      ref: 'dcp_dcpprojectteamid',
      attributes: [...TEAMMEMBER_ATTRS],
    },
    milestones: {
      ref: 'dcp_projectmilestoneid',
      attributes: [
        ...MILESTONE_ATTRS,

        // Virtual property — it's computed in the projects service
        'is_dcp_owned',
      ],
    },
  }),
)
@UseGuards(AuthenticateGuard)
@UsePipes(JsonApiDeserializePipe)
@Controller('projects')
export class ProjectsController {
  CRM_IMPOSTER_ID = '';

  constructor(
    private readonly projectsService: ProjectsService,
    private readonly contactService: ContactService,
    private readonly config: ConfigService,
    private readonly crmService: CrmService,
  ) {
    this.CRM_IMPOSTER_ID = this.config.get('CRM_IMPOSTER_ID');
  }

  @Get('/')
  async listOfCurrentUserProjects(@Session() session) {
    const { creeperTargetEmail } = session;
    let { contactId } = session;

    // if this needs to be in other parts of the app, consider a pipe or interceptor
    if (creeperTargetEmail) {
      try {
        const { contactid } =
          await this.contactService.findOneByEmail(creeperTargetEmail);

        contactId = contactid;
      } catch (e) {
        throw e;
      }
    }

    try {
      if (contactId) {
        return await this.projectsService.findManyByContactId(contactId);
      }
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      } else {
        throw new HttpException(
          {
            code: 'FIND_USER_PROJECTS_FAILED',
            title: 'Failed getting projects',
            detail: `An unknown server error occured while getting projects. ${e.message}`,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Post('/')
  async createProject(@Body() body) {
    const allowedAttrs = pick(body, PROJECT_ATTRS);
    console.debug("allowed", allowedAttrs);
    if (!this.config.featureFlag.selfService) {
      throw new HttpException({
        code: "NOT_FOUND",
        title: "Not found",
      },
      HttpStatus.NOT_FOUND)
    }

    const newProject = await this.crmService.create('dcp_projects', {
      'dcp_projectname': allowedAttrs['dcp_projectname'],
      'dcp_borough': allowedAttrs['dcp_borough'],
      'dcp_applicanttype': allowedAttrs['dcp_applicanttype'],
      'dcp_applicant_customer_contact@odata.bind': `/contacts(${allowedAttrs['_dcp_applicant_customer_value']})`,
      'dcp_applicantadministrator_customer_contact@odata.bind': `/contacts(${allowedAttrs['_dcp_applicantadministrator_customer_value']})`,
    })
    return newProject;
  }

  @Get('/:id')
  async projectById(@Param('id') id) {
    try {
      return await this.projectsService.getProject(id);
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      } else {
        throw new HttpException(
          {
            code: 'FIND_PROJECT_FAILED',
            title: 'Failed getting a project',
            detail: `An unknown server error occured while finding a project by ID. ${e.message}`,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Patch('/:id')
  async update(@Body() body, @Param('id') id) {
    const allowedAttrs = pick(body, PROJECT_ATTRS);

    await this.crmService.update('dcp_projects', id, allowedAttrs);

    return {
      dcp_projectid: id,
      ...allowedAttrs,
    };
  }
}
