import { Controller, Patch, Body, Param, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common';
import { AuthenticateGuard } from '../../authenticate.guard';
import { JsonApiSerializeInterceptor } from '../../json-api-serialize.interceptor';
import { JsonApiDeserializePipe } from '../../json-api-deserialize.pipe';
import { CrmService } from '../../crm/crm.service';
import { pick } from 'underscore';
import { PAS_FORM_ATTRS } from './pas-form.attrs';

@UseInterceptors(new JsonApiSerializeInterceptor('pas-forms', {
  attributes: [
    ...PAS_FORM_ATTRS,
  ],
}))
@UseGuards(AuthenticateGuard)
@UsePipes(JsonApiDeserializePipe)
@Controller('pas-forms')
export class PasFormController {
  constructor(private readonly crmService: CrmService) {}

  @Patch('/:id')
  async update(@Body() body, @Param('id') id) {
    const allowedAttrs = pick(body, PAS_FORM_ATTRS);

    await this.crmService.update('dcp_pasforms', id, allowedAttrs);

    return {
      dcp_pasformid: id,
      ...body
    };
  }
}
