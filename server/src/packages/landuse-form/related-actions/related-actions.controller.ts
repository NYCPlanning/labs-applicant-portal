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
  import { RELATED_ACTION_ATTRS } from './related-actions.attrs';
  
  @UseInterceptors(
    new JsonApiSerializeInterceptor('related-actions', {
      id: 'dcp_relatedactionsid',
      attributes: [...RELATED_ACTION_ATTRS],
    }),
  )
  @UseGuards(AuthenticateGuard)
  @UsePipes(JsonApiDeserializePipe)
  @Controller('related-actions')
  export class RelatedActionsController {
    constructor(private readonly crmService: CrmService) {}
  
    @Patch('/:id')
    async update(@Body() body, @Param('id') id) {
      const allowedAttrs = pick(body, RELATED_ACTION_ATTRS);
  
        await this.crmService.update(
          'dcp_relatedactionses',
          id,
          allowedAttrs,
        );
  
      return {
        dcp_relatedactionsid: id,
        allowedAttrs,
      };
    }
  
    @Post('/')
    create(@Body() body) {
      const allowedAttrs = pick(body, RELATED_ACTION_ATTRS);

      return this.crmService.create('dcp_relatedactionses', {
        ...allowedAttrs,
        'dcp_landuseid@odata.bind': `/dcp_landuses(${body.landuse_form})`,
      });
    }
  
    @Delete('/:id')
    async delete(@Param('id') id) {

      await this.crmService.delete('dcp_relatedactionses', id);
  
      return {
        id,
      };
    }
  }
  