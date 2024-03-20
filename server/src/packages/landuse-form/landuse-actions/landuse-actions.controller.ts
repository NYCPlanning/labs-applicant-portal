import {
  Controller,
  Patch,
  Body,
  Param,
  UseInterceptors,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { pick } from 'underscore';
import { CrmService } from '../../../crm/crm.service';
import { JsonApiSerializeInterceptor } from '../../../json-api-serialize.interceptor';
import { AuthenticateGuard } from '../../../authenticate.guard';
import { JsonApiDeserializePipe } from '../../../json-api-deserialize.pipe';
import { LANDUSE_ACTION_ATTRS } from './landuse-actions.attrs';

@UseInterceptors(
  new JsonApiSerializeInterceptor('landuse-actions', {
    id: 'dcp_landuseactionid',
    attributes: [...LANDUSE_ACTION_ATTRS],
  }),
)
@UseGuards(AuthenticateGuard)
@UsePipes(JsonApiDeserializePipe)
@Controller('landuse-actions')
export class LanduseActionsController {
  constructor(private readonly crmService: CrmService) {}

  @Patch('/:id')
  async update(@Body() body, @Param('id') id) {
    const allowedAttrs = pick(body, LANDUSE_ACTION_ATTRS);
    const dateOfPreviousApproval = this.pickDate(body.dcp_dateofpreviousapproval);
    const lapseDateOfPreviousApproval = this.pickDate(body.dcp_lapsedateofpreviousapproval);
    const recordationDate = this.pickDate(body.dcp_recordationdate);

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
    if (body.chosen_zoning_resolution_id) {
      allowedAttrs['dcp_zoningresolutionsectionactionispursuantto@odata.bind'] = `/dcp_zoningresolutions(${body.chosen_zoning_resolution_id})`;
    } else if (body.chosen_zoning_resolution_id === null) {
      await this.crmService.disassociateHasOne('dcp_zoningresolutionsectionactionispursuantto', 'dcp_landuseactions', id);
    }

    await this.crmService.update('dcp_landuseactions', id, {
      ...allowedAttrs,

      dcp_dateofpreviousapproval: dateOfPreviousApproval,
      dcp_lapsedateofpreviousapproval: lapseDateOfPreviousApproval,
      dcp_recordationdate: recordationDate,
    });

    return {
      dcp_landuseactionid: id,
      allowedAttrs,
    };
  }

  // when a user selects a date from the frontend date-picker, this value
  // is sent to backend as a datestring in an array, so we need to grab
  // the first item in that array. When the user does not use the date-picker,
  // and instead the date value comes from CRM (still exists in the body), the
  // date is just formatted as an isolated datestring and does not need to be reformatted.
  pickDate(bodyDateField) {
    if (bodyDateField) {
      return Array.isArray(bodyDateField) ? bodyDateField[0] : bodyDateField;
    } else {
      return null;
    };
  }
}
