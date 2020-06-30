import { Controller, Patch, Body, Param, UseGuards, UseInterceptors, UsePipes, Post } from '@nestjs/common';
import { AuthenticateGuard } from '../../../authenticate.guard';
import { JsonApiSerializeInterceptor } from '../../../json-api-serialize.interceptor';
import { JsonApiDeserializePipe } from '../../../json-api-deserialize.pipe';
import { pick } from 'underscore';
import { AFFECTED_ZONING_RESOLUTION_ATTRIBUTES } from './affected-zoning-resolutions.attrs';
import { CrmService } from '../../../crm/crm.service';

@UseInterceptors(new JsonApiSerializeInterceptor('affected-zoning-resolutions', {
  attributes: [
    ...AFFECTED_ZONING_RESOLUTION_ATTRIBUTES,
  ],
}))
@UseGuards(AuthenticateGuard)
@UsePipes(JsonApiDeserializePipe)
@Controller('affected-zoning-resolutions')
export class AffectedZoningResolutionsController {
  constructor(private readonly crmService: CrmService) {}

  @Patch('/:id')
  async update(@Body() body, @Param('id') id) {
    const allowedAttrs = pick(body, AFFECTED_ZONING_RESOLUTION_ATTRIBUTES);

    await this.crmService.update(
      'dcp_affectedzoningresolutions',
      id,
      allowedAttrs,
    );

    return {
      dcp_affectedzoningresolutionid: id,
      ...body
    };
  }
}
