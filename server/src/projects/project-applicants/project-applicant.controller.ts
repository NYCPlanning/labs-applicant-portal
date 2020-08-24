import { Controller, Body, Post, UseInterceptors, UseGuards, UsePipes, HttpException, HttpStatus } from '@nestjs/common';
import { pick } from 'underscore';
import { CrmService } from '../../crm/crm.service';
import { JsonApiSerializeInterceptor } from '../../json-api-serialize.interceptor';
import { AuthenticateGuard } from '../../authenticate.guard';
import { JsonApiDeserializePipe } from '../../json-api-deserialize.pipe';
import { PROJECTAPPLICANT_ATTRS } from './project-applicants.attrs';
import { CONTACT_ATTRS } from '../../contact/contacts.attrs';

const ACTIVE_CODE = 1;

@UseInterceptors(new JsonApiSerializeInterceptor('project-applicants', {
  id: 'dcp_projectapplicantid',
  attributes: [
    ...PROJECTAPPLICANT_ATTRS,

    'contact',
  ],

  contact: {
    ref: 'contactid',
    attributes: CONTACT_ATTRS,
  },
}))
@UseGuards(AuthenticateGuard)
@UsePipes(JsonApiDeserializePipe)
@Controller('project-applicants')
export class ProjectApplicantController {
  constructor(private readonly crmService: CrmService) {}

  @Post('/')
  async create(@Body() body) {
    const allowedAttrs = pick(body, PROJECTAPPLICANT_ATTRS);
    const {
      emailaddress: email,
      project: projectId,
    } = body;

    if (!email || !projectId) {
      throw new HttpException({
        code: 'ADD_PROJECT_APPLICANT_ERROR',
        title: 'Add Project Applicant failed',
        detail: 'Cannot add project applicant because missing email or project id',
      }, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    // check if contact already exists for this email address
    const { records } = await this.crmService.get('contacts', `
      $select=${CONTACT_ATTRS.join(',')}
      &$filter=startswith(emailaddress1, '${email}')
        and statuscode eq ${ACTIVE_CODE}
      &$top=1
    `);

    let contactId;

    let newContact = {
      contactid: null,
    };

    if (records.length > 0) {
      contactId = records[0].contactid;
    } else {
      newContact = await this.crmService.create(`contacts`, {
        'emailaddress1': email,
      });
      contactId = newContact.contactid;
    }

    const newProjectApplicant = await this.crmService.create('dcp_projectapplicants', {
      ...allowedAttrs,

      // Dy365 syntax for associating a newly-created record
      // with an existing record.
      // see: https://docs.microsoft.com/en-us/powerapps/developer/common-data-service/webapi/create-entity-web-api#associate-entity-records-on-create
      ...(projectId ? { 'dcp_Project@odata.bind': `/dcp_projects(${projectId})` } : {}),
      "dcp_applicant_customer_contact@odata.bind": `/contacts(${contactId})`,
    });
    return {
      ...newProjectApplicant,
       contact: newContact,
    }
  }
}
