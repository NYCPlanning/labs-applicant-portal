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
// dcp_applicantinformation and dcp_applicantrepresentativeinformation
// TODO: This controller exposes these two entites as one "applicant" resource
// and handles routes applicant resources from and to the appropriate CRM entity
// the frontend provides (and needs) a custom property "targetEntity"
// to track the ultimate CRM entity destination (and source when getting existing)

export const APPLICANT_ATTRIBUTES = [
  'dcp_firstname',
  'dcp_lastname',
  'dcp_organization',
  'dcp_email',
  'dcp_address',
  'dcp_city',
  'dcp_state',
  'dcp_zipcode',
  'dcp_phone',
  'dcp_type', // only on dcp_applicantinformation entity, not applicantrepresentative
  'targetEntity', // custom attribute to route to/from correct crm entity
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
    const allowedAttrs = pick(body, APPLICANT_ATTRIBUTES);

    if (body.pas_form) {
      return this.crmService.create('dcp_applicantinformations', {
        ...allowedAttrs,

        // Dy365 syntax for associating a newly-created record
        // with an existing record.
        // see: https://docs.microsoft.com/en-us/powerapps/developer/common-data-service/webapi/create-entity-web-api#associate-entity-records-on-create
        'dcp_dcp_applicantinformation_dcp_pasform@odata.bind': [
          `/dcp_pasforms(${body.pas_form})`,
        ],
      });
    } else {
      return this.crmService.create('dcp_applicantinformations', allowedAttrs);
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
