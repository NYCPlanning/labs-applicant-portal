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
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { pick } from 'underscore';
import { CrmService } from '../../crm/crm.service';
import { JsonApiSerializeInterceptor } from '../../json-api-serialize.interceptor';
import { AuthenticateGuard } from '../../authenticate.guard';
import { JsonApiDeserializePipe } from '../../json-api-deserialize.pipe';
import { BBL_ATTRS } from './bbls.attrs';

@UseInterceptors(
  new JsonApiSerializeInterceptor('bbls', {
    id: 'dcp_projectbblid',
    attributes: [...BBL_ATTRS],
  }),
)
@UseGuards(AuthenticateGuard)
@UsePipes(JsonApiDeserializePipe)
@Controller('bbls')
export class BblsController {
  constructor(private readonly crmService: CrmService) {}

  @Patch('/:id')
  async update(@Body() body, @Param('id') id) {
    const allowedAttrs = pick(body, BBL_ATTRS);

    await this.crmService.update('dcp_projectbbls', id, allowedAttrs);

    return {
      dcp_projectbblid: id,
      ...body,
    };
  }

  @Post('/')
  create(@Body() body) {
    const allowedAttrs = pick(body, BBL_ATTRS);

    if (!(body.pas_form || body.landuse_form) || !body.project)
      throw new HttpException(
        {
          code: 'POST_BBL_FAILED',
          title: 'Error creating BBL',
          detail: 'Missing form or project ids',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );

    return this.crmService.create('dcp_projectbbls', {
      ...allowedAttrs,

      // Dy365 syntax for associating a newly-created record
      // with an existing record.
      // see: https://docs.microsoft.com/en-us/powerapps/developer/common-data-service/webapi/create-entity-web-api#associate-entity-records-on-create
      ...(body.landuse_form
        ? {
            'dcp_dcp_projectbbl_dcp_landuse@odata.bind': [
              `/dcp_landuses(${body.landuse_form})`,
            ],
          }
        : {}),
      ...(body.pas_form
        ? {
            'dcp_dcp_projectbbl_dcp_pasform@odata.bind': [
              `/dcp_pasforms(${body.pas_form})`,
            ],
          }
        : {}),
      ...(body.project
        ? { 'dcp_project@odata.bind': `/dcp_projects(${body.project})` }
        : {}),
    });
  }

  @Delete('/:id')
  async delete(@Param('id') id) {
    await this.crmService.delete('dcp_projectbbls', id);

    return {
      id,
    };
  }
}
