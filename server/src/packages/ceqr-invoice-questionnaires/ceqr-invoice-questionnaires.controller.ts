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
import { CEQR_INVOICE_QUESTIONNAIRE_ATTRS } from './ceqr-invoice-questionnaires.attrs';

@UseInterceptors(
  new JsonApiSerializeInterceptor('ceqr-invoice-questionnaires', {
    id: 'dcp_ceqrinvoicequestionnaireid',
    attributes: [...CEQR_INVOICE_QUESTIONNAIRE_ATTRS],
  }),
)
@UseGuards(AuthenticateGuard)
@UsePipes(JsonApiDeserializePipe)
@Controller('ceqr-invoice-questionnaires')
export class CeqrInvoiceQuestionnairesController {
  constructor(private readonly crmService: CrmService) {}

  @Patch('/:id')
  async update(@Body() body, @Param('id') id) {
    const allowedAttrs = pick(body, CEQR_INVOICE_QUESTIONNAIRE_ATTRS);

    await this.crmService.update('dcp_ceqrinvoicequestionnaires', id, {
      ...allowedAttrs,
      'dcp_Package@odata.bind': `/dcp_packages(${body.package})`,
    });

    return {
      dcp_ceqrinvoicequestionnaireid: id,
      ...body,
    };
  }
}
