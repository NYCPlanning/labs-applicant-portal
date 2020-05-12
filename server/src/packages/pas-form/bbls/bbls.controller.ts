import { Controller, Patch, Body, Param, Post, UseInterceptors, UseGuards, UsePipes, Delete } from '@nestjs/common';
import { pick } from 'underscore';
import { CrmService } from '../../../crm/crm.service';
import { JsonApiSerializeInterceptor } from '../../../json-api-serialize.interceptor';
import { AuthenticateGuard } from '../../../authenticate.guard';
import { JsonApiDeserializePipe } from '../../../json-api-deserialize.pipe';

export const BBL_ATTRIBUTES = [
  'dcp_partiallot',
  'dcp_developmentsite',
  'dcp_bblnumber',
  'dcp_userinputborough',
  'dcp_userinputblock',
  'dcp_userinputlot',
];

@UseInterceptors(new JsonApiSerializeInterceptor('bbls', {
  id: 'dcp_projectbblid',
  attributes: [
    ...BBL_ATTRIBUTES,
  ],
}))
@UseGuards(AuthenticateGuard)
@UsePipes(JsonApiDeserializePipe)
@Controller('bbls')
export class BblsController {
  constructor(private readonly crmService: CrmService) {}

  @Patch('/:id')
  async update(@Body() body, @Param('id') id) {
    const allowedAttrs = pick(body, BBL_ATTRIBUTES);

    await this.crmService.update('dcp_projectbbls', id, allowedAttrs);

    return {
      dcp_projectbblid: id,
      ...body,
    }
  }

  @Post('/')
  create(@Body() body) {
    const allowedAttrs = pick(body, BBL_ATTRIBUTES);

    if (body.pas_form) {
      return this.crmService.create('dcp_projectbbls', {
        ...allowedAttrs,

        // Dy365 syntax for associating a newly-created record
        // with an existing record.
        // see: https://docs.microsoft.com/en-us/powerapps/developer/common-data-service/webapi/create-entity-web-api#associate-entity-records-on-create
        'dcp_dcp_projectbbl_dcp_pasform@odata.bind': [`/dcp_pasforms(${body.pas_form})`],
      });
    } else {
      return this.crmService.create('dcp_projectbbls', allowedAttrs);
    }
  }

  @Delete('/:id')
  async delete(@Param('id') id) {
    await this.crmService.delete('dcp_projectbbls', id);

    return {
      id,
    };
  }
}
