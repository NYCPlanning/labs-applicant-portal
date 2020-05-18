import {
  Controller,
  Patch,
  Body,
  Param,
  Post,
  UseInterceptors,
  UseGuards,
  UsePipes,
  Delete,
} from '@nestjs/common';
import { pick } from 'underscore';
import { CrmService } from '../../../crm/crm.service';
import { JsonApiSerializeInterceptor } from '../../../json-api-serialize.interceptor';
import { AuthenticateGuard } from '../../../authenticate.guard';
import { JsonApiDeserializePipe } from '../../../json-api-deserialize.pipe';

// CRM has two entities that encompass the applicant team, 
// dcp_applicantinformation and dcp_applicantrepinformation
// TODO: This controller exposes these two entites as one "applicant" resource
// and handles routes applicant resources from and to the appropriate CRM entity
// the frontend provides (and needs) a custom property "targetEntity"
// to track the ultimate CRM entity destination (and source when getting existing)

export const APPLICANT_REPRESENTATIVE_ATTRIBUTES = [
  'dcp_firstname',
  'dcp_lastname',
  'dcp_organization',
  'dcp_email',
  'dcp_address',
  'dcp_city',
  'dcp_state',
  'dcp_zipcode',
  'dcp_phone',
];

export const APPLICANT_ATTRIBUTES = [
  ...APPLICANT_REPRESENTATIVE_ATTRIBUTES,
  'dcp_type',
];


@UseInterceptors(
  new JsonApiSerializeInterceptor('applicants', {
    id: 'dcp_applicantinformationid',
    attributes: [...APPLICANT_ATTRIBUTES],
  }),
)
@UseGuards(AuthenticateGuard)
@UsePipes(JsonApiDeserializePipe)
@Controller('applicants')
export class ApplicantsController {
  constructor(private readonly crmService: CrmService) {}

  @Patch('/:id')
  async update(@Body() body, @Param('id') id) {
    const allowedAttrs = pick(body, APPLICANT_ATTRIBUTES);

    await this.crmService.update('dcp_applicantinformations', id, allowedAttrs);

    return {
      dcp_applicantinformationid: id,
      ...body,
    };
  }

  @Post('/')
  create(@Body() body) {
    const { target_entity } = body;
  
    let allowedAttrs;

    // determine the appropraite attributes based on the entity type
    if (target_entity === 'dcp_applicantinformation') {
      allowedAttrs = pick(body, APPLICANT_ATTRIBUTES);
    } else if (target_entity === 'dcp_applicantrepinformation') {
      allowedAttrs = pick(body, APPLICANT_REPRESENTATIVE_ATTRIBUTES);
    }

    if (body.pas_form) {
      let applicantBody = {
        ...allowedAttrs,
      }
      const objKey = `dcp_${target_entity}_dcp_pasform@odata.bind` 
      // Dy365 syntax for associating a newly-created record
      // with an existing record.
      // see: https://docs.microsoft.com/en-us/powerapps/developer/common-data-service/webapi/create-entity-web-api#associate-entity-records-on-create
      applicantBody[objKey] = [`/dcp_pasforms(${body.pas_form})`]

      console.log(applicantBody);
      
      return this.crmService.create(`${target_entity}s`, applicantBody);
    } else {
      return this.crmService.create(`${target_entity}s`, allowedAttrs);
    }
  }

  @Delete('/:id')
  async delete(@Param('id') id) {
    await this.crmService.delete('dcp_applicantinformations', id);

    return {
      id,
    };
  }
}


