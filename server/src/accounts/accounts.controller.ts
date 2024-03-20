import {
  Controller,
  Get,
  Patch,
  Body,
  Query,
  HttpException,
  HttpStatus,
  Session,
  UseInterceptors,
  UseGuards,
  UsePipes,
  Param,
} from '@nestjs/common';
import { CrmService } from '../crm/crm.service';
import { JsonApiSerializeInterceptor } from '../json-api-serialize.interceptor';
import { AuthenticateGuard } from '../authenticate.guard';
import { JsonApiDeserializePipe } from '../json-api-deserialize.pipe';
import { ACCOUNT_ATTRS } from './accounts.attrs';
import { pick } from 'underscore';

const ACTIVE_STATUSCODE = 1;

@UseInterceptors(
  new JsonApiSerializeInterceptor('accounts', {
    id: 'accountid',
    attributes: [...ACCOUNT_ATTRS],

    transform(account) {
      try {
        return {
          ...account,
        };
      } catch (e) {
        if (e instanceof HttpException) {
          throw e;
        } else {
          throw new HttpException(
            {
              code: 'ACCOUNTS_ERROR',
              title: 'Failed load accounts',
              detail: `An error occurred while loading one or more accounts. ${e.message}`,
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }
    },
  }),
)
@UseGuards(AuthenticateGuard)
@UsePipes(JsonApiDeserializePipe)
@Controller('accounts')
export class AccountsController {
  constructor(private readonly crmService: CrmService) {}

  @Get('/')
  async accounts() {
    try {
      const { records } = await this.crmService.get(
        'accounts',
        `$select=name
          &$filter=
          statuscode eq ${ACTIVE_STATUSCODE}
          and dcp_agencyceqracronym ne null
      `,
      );
      return records;
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      } else {
        throw new HttpException(
          {
            code: 'FIND_ACCOUNTS_FAILED',
            title: 'Failed getting accounts',
            detail: `An unknown server error occured while getting accounts. ${e.message}`,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
