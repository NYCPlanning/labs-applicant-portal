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
    console.log('sunflower', body);

    const dateOfPreviousApproval = body.dcp_dateofpreviousapproval[0];
    const lapseDateOfPreviousApproval = body.dcp_lapsedateofpreviousapproval[0];
    const recordationDate = body.dcp_recordationdate[0];

    await this.crmService.update('dcp_landuseactions', id, {
      ...allowedAttrs,

      ...(body.chosen_zoning_resolution_id ? { 'dcp_zoningresolutionsectionactionispursuantto@odata.bind': `/dcp_zoningresolutions(${body.chosen_zoning_resolution_id})` } : {}),
      dcp_dateofpreviousapproval: dateOfPreviousApproval,
      dcp_lapsedateofpreviousapproval: lapseDateOfPreviousApproval,
      dcp_recordationdate: recordationDate,
    });

    return {
      dcp_landuseactionid: id,
      allowedAttrs,
    };
  }
}
