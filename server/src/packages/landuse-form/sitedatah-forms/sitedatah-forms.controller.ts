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
  import { SITEDATAH_FORM_ATTRS } from './sitedatah-form.attrs';
  
  @UseInterceptors(
    new JsonApiSerializeInterceptor('sitedatah-forms', {
      id: 'dcp_sitedatahformsid',
      attributes: [...SITEDATAH_FORM_ATTRS],
    }),
  )
  @UseGuards(AuthenticateGuard)
  @UsePipes(JsonApiDeserializePipe)
  @Controller('sitedatah-forms')
  export class SitedatahFormsController {
    constructor(private readonly crmService: CrmService) {}
  
    @Patch('/:id')
    async update(@Body() body, @Param('id') id) {
      const allowedAttrs = pick(body, SITEDATAH_FORM_ATTRS);
  
        await this.crmService.update(
          'dcp_sitedatahforms',
          id,
          allowedAttrs,
        );
  
      return {
        dcp_sitedatahformsid: id,
        allowedAttrs,
      };
    }
  
    @Post('/')
    create(@Body() body) {
      const allowedAttrs = pick(body, SITEDATAH_FORM_ATTRS);

      return this.crmService.create('dcp_sitedatahforms', {
        ...allowedAttrs,
        'dcp_landuseform@odata.bind': `/dcp_landuses(${body.landuse_form})`,
      });
    }
  
    @Delete('/:id')
    async delete(@Param('id') id) {

      await this.crmService.delete('dcp_sitedatahforms', id);
  
      return {
        id,
      };
    }
  }
  