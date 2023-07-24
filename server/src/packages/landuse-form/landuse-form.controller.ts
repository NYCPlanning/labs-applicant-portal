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
    let allowedAttrs = pick(body, LANDUSE_FORM_ATTRS);
    console.log("LAND USE CONTROLLER BODY", body);
    console.log("LAND USE CONTROLLER ALLOWED ATTRS", allowedAttrs);

    // "chosen_zoning_resolution_id" is the id to a related resource,
    // but, unlike other attributes, it may not always be included
    // in the request body.
    // If a request does not include all of the relationships
    // for a resource, the server MUST interpret the missing relationships
    // as if they were included with their current values. It MUST NOT
    // interpret them as null or empty values.
    // Therefore, we explicitly check for a null value
    // (which would imply a key for chosen_zoning_resolution_id),
    // to avoid assuming that falsiness indicates a disassociation.
    if (body.chosen_lead_agency_id) {
      allowedAttrs['dcp_leadagency@odata.bind'] = `/accounts(${body.chosen_lead_agency_id})`;
    } else if (body.chosen_lead_agency_id === null) {
      await this.crmService.disassociateHasOne('dcp_leadagency', 'dcp_landuses', id);
    }

    await this.crmService.update('dcp_landuses', id, {
      ...allowedAttrs,
    });

    return {
      dcp_landuseid: id,
      ...body
    };
  }
}
