import {
  Controller,
  Patch,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { AuthenticateGuard } from '../../authenticate.guard';
import { JsonApiSerializeInterceptor } from '../../json-api-serialize.interceptor';
import { JsonApiDeserializePipe } from '../../json-api-deserialize.pipe';
import { CrmService } from '../../crm/crm.service';
import { pick } from 'underscore';
import { LANDUSE_FORM_ATTRS } from './landuse-form.attrs';


@UseInterceptors(new JsonApiSerializeInterceptor('landuse-forms', {
  attributes: [
    ...LANDUSE_FORM_ATTRS,

    // this is an association. before, we thought it wasn't!
    'dcp_leadagency',
  ],
}))
@UseGuards(AuthenticateGuard)
@UsePipes(JsonApiDeserializePipe)
@Controller('landuse-forms')
export class LanduseFormController {
  constructor(private readonly crmService: CrmService) { }

  @Patch('/:id')
  async update(@Body() body, @Param('id') id) {
    const allowedAttrs = pick(body, LANDUSE_FORM_ATTRS);

    await this.crmService.update('dcp_landuses', id, {
      ...allowedAttrs,

      ...(body.chosen_lead_agency_id ? { 'dcp_leadagency@odata.bind': `/accounts(${body.chosen_lead_agency_id})` } : {}),
    });

    return {
      dcp_landuseid: id,
      ...body
    };
  }
}
