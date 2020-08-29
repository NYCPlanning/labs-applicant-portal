import { Controller, Patch, Body, Param, Post, UseInterceptors, UseGuards, UsePipes, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { pick } from 'underscore';
import { CrmService } from '../../crm/crm.service';
import { JsonApiSerializeInterceptor } from '../../json-api-serialize.interceptor';
import { AuthenticateGuard } from '../../authenticate.guard';
import { JsonApiDeserializePipe } from '../../json-api-deserialize.pipe';
import { PROJECTAPPLICANT_ATTRS } from './project-applicants.attrs';
import { CONTACT_ATTRS } from '../../contact/contacts.attrs';

const ACTIVE_STATUSCODE = 1;
const INACTIVE_STATUSCODE = 2;

const ACTIVE_STATECODE = 0;
const INACTIVE_STATECODE = 1;

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
    const email = body.emailaddress;
    const projectId = body.project;
    const fullName = body.dcp_name;

    let contactId;

    // check if contact already exists for this email address
    const { records } = await this.crmService.get('contacts', `
      $select=${CONTACT_ATTRS.join(',')}
      &$filter=startswith(emailaddress1, '${email}')
        and statuscode eq ${ACTIVE_STATUSCODE}
      &$top=1
    `);

    let newContact = {
      contactid: null,
    };

    if (records.length > 0) {
      contactId = records[0].contactid;
    } else {
      const regex = /^([\w\-]+)/g;
      const firstName = fullName.match(regex)[0];
      const lastName = fullName.replace(`${firstName} `, '');
      newContact = await this.crmService.create(`contacts`, {
        'emailaddress1': email,
        'firstname': firstName,
        'lastname': lastName,
      });
      contactId = newContact.contactid;
    }

    if (!body.emailaddress || !body.project) throw new HttpException(
      'Missing email address or project id',
      HttpStatus.UNPROCESSABLE_ENTITY,
    );

    const newProjectApplicant = await this.crmService.create('dcp_projectapplicants', {
      ...allowedAttrs,

      // Dy365 syntax for associating a newly-created record
      // with an existing record.
      // see: https://docs.microsoft.com/en-us/powerapps/developer/common-data-service/webapi/create-entity-web-api#associate-entity-records-on-create
      ...(body.project ? { 'dcp_Project@odata.bind': `/dcp_projects(${projectId})` } : {}),
      "dcp_applicant_customer_contact@odata.bind": `/contacts(${contactId})`,
    });
    return {
      ...newProjectApplicant,
       contact: newContact,
    }
  }

  @Delete('/:id')
  async deactivate(@Param('id') id) {
    try {
      await this.crmService.update('dcp_projectapplicants', id, {
        statuscode: INACTIVE_STATUSCODE,
        statecode: INACTIVE_STATECODE,
      });

      return {
        id,
      };
    } catch (e) {
      console.log(e);
      throw new HttpException({
        code: 'PROJECT_APPLICANT_DEACTIVATE_FAILED',
        title: 'Failed to deactivate project applicant',
        detail: `${e}`,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
