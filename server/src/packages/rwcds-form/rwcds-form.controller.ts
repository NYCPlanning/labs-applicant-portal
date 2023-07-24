import {
  Controller,
  Patch,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UsePipes
} from '@nestjs/common';
import { AuthenticateGuard } from '../../authenticate.guard';
import { JsonApiSerializeInterceptor } from '../../json-api-serialize.interceptor';
import { JsonApiDeserializePipe } from '../../json-api-deserialize.pipe';
// import { RwcdsFormService } from './rwcds-form.service';
import { CrmService } from '../../crm/crm.service';
import { pick } from 'underscore';
import { RWCDS_FORM_ATTRS } from './rwcds-form.attrs';

@UseInterceptors(new JsonApiSerializeInterceptor('rwcds-forms', {
  attributes: [
    ...RWCDS_FORM_ATTRS,
  ],
}))
@UseGuards(AuthenticateGuard)
@UsePipes(JsonApiDeserializePipe)
@Controller('rwcds-forms')
export class RwcdsFormController {
  constructor(private readonly CrmService: CrmService) {}

  @Patch('/:id')
  async update(@Body() body, @Param('id') id) {
    console.log("***** RWCDS form Controller *****", body);
    const allowedAttrs = pick(body, RWCDS_FORM_ATTRS);

    console.log('***** RWCDS form Controller allowed attributes *****', allowedAttrs);
    await this.CrmService.update('dcp_rwcdsforms', id, allowedAttrs); // investigate form service
    return {
      dcp_rwcdsformid: id,
      ...body
    };
  }
}
