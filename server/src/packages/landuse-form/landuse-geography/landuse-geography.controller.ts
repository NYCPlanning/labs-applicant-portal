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
  import { LANDUSE_GEOGRAPHY_ATTRS } from './landuse-geography.attrs';
  
  @UseInterceptors(
    new JsonApiSerializeInterceptor('landuse-geographies', {
      id: 'dcp_landusegeographyid',
      attributes: [...LANDUSE_GEOGRAPHY_ATTRS],
    }),
  )
  @UseGuards(AuthenticateGuard)
  @UsePipes(JsonApiDeserializePipe)
  @Controller('landuse-geographies')
  export class LanduseGeographyController {
    constructor(private readonly crmService: CrmService) {}

    @Patch('/:id')
    async update(@Body() body, @Param('id') id) {
      const allowedAttrs = pick(body, LANDUSE_GEOGRAPHY_ATTRS);
  
        await this.crmService.update(
          'dcp_landusegeographies',
          id,
          allowedAttrs,
        );
  
      return {
        dcp_landusegeographyid: id,
        allowedAttrs,
      };
    }

    @Post('/')
    create(@Body() body) {
      const allowedAttrs = pick(body, LANDUSE_GEOGRAPHY_ATTRS);

      return this.crmService.create('dcp_landusegeographies', {
        ...allowedAttrs,
        'dcp_landuseform@odata.bind': `/dcp_landuses(${body.landuse_form})`,
      });
    }
  
    @Delete('/:id')
    async delete(@Param('id') id) {

      await this.crmService.delete('dcp_landusegeographies', id);
  
      return {
        id,
      };
    }
  }
