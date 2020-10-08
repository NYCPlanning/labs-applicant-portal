import {
    Controller,
    Get,
    HttpException,
    HttpStatus,
    UseInterceptors,
    UseGuards,
    UsePipes,
  } from '@nestjs/common';
  import { CrmService } from '../crm/crm.service';
  import { JsonApiSerializeInterceptor } from '../json-api-serialize.interceptor';
  import { AuthenticateGuard } from '../authenticate.guard';
  import { JsonApiDeserializePipe } from '../json-api-deserialize.pipe';
  import { ZONINGRESOLUTION_ATTRS } from './zoning-resolutions.attrs';

  const ACTIVE_STATUSCODE = 1;
  const ACTIVE_STATECODE = 0;
  
  @UseInterceptors(new JsonApiSerializeInterceptor('zoning-resolutions', {
    id: 'dcp_zoningresolutionid',
    attributes: [
      ...ZONINGRESOLUTION_ATTRS,
    ],
  
    transform(zoningResolution) {
      try {
        return {
          ...zoningResolution,
        };
      } catch(e) {
        if (e instanceof HttpException) {
          throw e;
        } else {
          throw new HttpException({
            code: 'ZONINGRESOLUTIONS_ERROR',
            title: 'Failed load zoning resolutions',
            detail: `An error occurred while loading one or more zoning resolutions. ${e.message}`,
          }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }
    },
  }))
  @UseGuards(AuthenticateGuard)
  @UsePipes(JsonApiDeserializePipe)
  @Controller('zoning-resolutions')
  export class ZoningResolutionsController {
    constructor(
      private readonly crmService: CrmService,
    ) {}
  
    @Get('/')
    async zoningResolutions() {
      try {
        const { records } = await this.crmService.get('dcp_zoningresolutions',
          `$select=dcp_zoningresolution
          &$filter=
          statuscode eq ${ACTIVE_STATUSCODE}
          and statecode eq ${ACTIVE_STATECODE}
      `);
        return records;
      } catch (e) {
        if (e instanceof HttpException) {
          throw e;
        } else {
          throw new HttpException({
            code: 'FIND_ZONINGRESOLUTIONS_FAILED',
            title: 'Failed getting zoning resolutions',
            detail: `An unknown server error occured while getting zoning resolutions. ${e.message}`,
          }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }
    }
  }
  