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

    const applicationDate = this.pickDate(body.dcp_applicationdate);

    await this.crmService.update('dcp_relatedactionses', id, {
      ...allowedAttrs,

      dcp_applicationdate: applicationDate,
    });

    return {
      dcp_relatedactionsid: id,
      allowedAttrs,
    };
  }

  @Post('/')
  create(@Body() body) {
    const allowedAttrs = pick(body, RELATED_ACTION_ATTRS);
    // because this is a POST, the date field will either be
    // null or derived from the datepicker (and not coming from crm)
    // so we can assume if there's a date field that it's within an array
    const applicationDate = body.dcp_applicationdate
      ? this.pickDate(body.dcp_applicationdate)
      : null;

    return this.crmService.create('dcp_relatedactionses', {
      ...allowedAttrs,
      dcp_applicationdate: applicationDate,
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

  // when a user selects a date from the frontend date-picker, this value
  // is sent to backend as a datestring in an array, so we need to grab
  // the first item in that array. When the user does not use the date-picker,
  // and instead the date value comes from CRM (still exists in the body), the
  // date is just formatted as an isolated datestring and does not need to be reformatted.
  pickDate(bodyDateField) {
    if (bodyDateField) {
      return Array.isArray(bodyDateField) ? bodyDateField[0] : bodyDateField;
    } else {
      return null;
    }
  }
}
