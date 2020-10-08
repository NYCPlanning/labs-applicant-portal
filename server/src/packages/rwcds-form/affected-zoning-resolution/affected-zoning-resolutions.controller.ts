import { Controller, Patch, Body, Param, UseGuards, UseInterceptors, UsePipes, Post, Delete } from '@nestjs/common';
import { AuthenticateGuard } from '../../../authenticate.guard';
import { JsonApiSerializeInterceptor } from '../../../json-api-serialize.interceptor';
import { JsonApiDeserializePipe } from '../../../json-api-deserialize.pipe';
import { pick } from 'underscore';
import { AFFECTEDZONINGRESOLUTION_ATTRS } from './affected-zoning-resolutions.attrs';
import { CrmService } from '../../../crm/crm.service';

@UseInterceptors(new JsonApiSerializeInterceptor('affected-zoning-resolutions', {
  attributes: [
    ...AFFECTEDZONINGRESOLUTION_ATTRS,
  ],
}))
@UseGuards(AuthenticateGuard)
@UsePipes(JsonApiDeserializePipe)
@Controller('affected-zoning-resolutions')
export class AffectedZoningResolutionsController {
  constructor(private readonly crmService: CrmService) {}

  @Patch('/:id')
  async update(@Body() body, @Param('id') id) {
    const allowedAttrs = pick(body, AFFECTEDZONINGRESOLUTION_ATTRS);

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

  @Post('/')
  create(@Body() body) {
    const allowedAttrs = pick(body, AFFECTEDZONINGRESOLUTION_ATTRS);

    return this.crmService.create('dcp_affectedzoningresolutions', {
      ...allowedAttrs,
      'dcp_Landuseform@odata.bind': `/dcp_landuses(${body.landuse_form})`,
    });
  }

  @Delete('/:id')
  async delete(@Param('id') id) {

    await this.crmService.delete('dcp_affectedzoningresolutions', id);

    return {
      id,
    };
  }
}
