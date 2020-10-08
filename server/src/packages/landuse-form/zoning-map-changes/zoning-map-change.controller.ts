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
  import { ZONING_MAP_CHANGE_ATTRS } from './zoning-map-change.attrs';
  
  @UseInterceptors(
    new JsonApiSerializeInterceptor('zoning-map-changes', {
      id: 'dcp_zoningmapchangesid',
      attributes: [...ZONING_MAP_CHANGE_ATTRS],
    }),
  )
  @UseGuards(AuthenticateGuard)
  @UsePipes(JsonApiDeserializePipe)
  @Controller('zoning-map-changes')
  export class ZoningMapChangesController {
    constructor(private readonly crmService: CrmService) {}
  
    @Patch('/:id')
    async update(@Body() body, @Param('id') id) {
      const allowedAttrs = pick(body, ZONING_MAP_CHANGE_ATTRS);
  
        await this.crmService.update(
          'dcp_zoningmapchangeses',
          id,
          allowedAttrs,
        );
  
      return {
        dcp_zoningmapchangesid: id,
        allowedAttrs,
      };
    }
  
    @Post('/')
    create(@Body() body) {
      const allowedAttrs = pick(body, ZONING_MAP_CHANGE_ATTRS);

      return this.crmService.create('dcp_zoningmapchangeses', {
        ...allowedAttrs,
        // Due to CRM, dcp_LandUseForm here is case sensitive...
        'dcp_LandUseForm@odata.bind': `/dcp_landuses(${body.landuse_form})`,
      });
    }
  
    @Delete('/:id')
    async delete(@Param('id') id) {

      await this.crmService.delete('dcp_zoningmapchangeses', id);
  
      return {
        id,
      };
    }
  }
  