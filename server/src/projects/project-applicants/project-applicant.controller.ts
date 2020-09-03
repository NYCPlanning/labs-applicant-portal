import { Controller, Body, Post, UseInterceptors, UseGuards, UsePipes, HttpException, HttpStatus } from '@nestjs/common';
import { pick } from 'underscore';
import { CrmService } from '../../crm/crm.service';
import { JsonApiSerializeInterceptor } from '../../json-api-serialize.interceptor';
import { AuthenticateGuard } from '../../authenticate.guard';
import { JsonApiDeserializePipe } from '../../json-api-deserialize.pipe';
import { PROJECTAPPLICANT_ATTRS } from './project-applicants.attrs';
import { CONTACT_ATTRS } from '../../contact/contacts.attrs';

const ACTIVE_CONTACT_STATUSCODE = 1;
const INACTIVE_CONTACT_STATUSCODE = 2;

const ACTIVE_CONTACT_STATECODE = 0;
const INACTIVE_CONTACT_STATECODE = 1;

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
    // NOTE: dcp_name field in projectApplicant entity is automatically filled with...
    // the firstname and lastname fields in the contact entity. In order to get accurate
    // firstname and lastname values, we have "fake" firstname and lastname attributes in 
    // the frontend project-applicant model so we can send to backend. 
    const {
      emailaddress: email,
      project: projectId,
      firstname,
      lastname,
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
      &$top=1
    `);

    let contactId;

    let currentContact = {
      contactid: null,
    };

    if (records.length > 0) {
      contactId = records[0].contactid;
      currentContact = records[0];
      // if contact record is deactivated, reactive it
      if (records[0].statuscode === INACTIVE_CONTACT_STATUSCODE && records[0].statecode === INACTIVE_CONTACT_STATECODE) {
        this.crmService.update('contacts', contactId, {
          statuscode: ACTIVE_CONTACT_STATUSCODE,
          statecode: ACTIVE_CONTACT_STATECODE,
        });
      }
    } else {
      currentContact = await this.crmService.create(`contacts`, {
        firstname: firstname,
        lastname: lastname,
        emailaddress1: email,
      });
      contactId = currentContact.contactid;
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
       contact: currentContact,
    }
  }
}
