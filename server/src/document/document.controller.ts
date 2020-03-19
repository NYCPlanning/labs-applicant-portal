import { Controller,
  Post,
  Req,
  Res,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  HttpException,
  Session,
} from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { CRMWebAPI } from '../_utils/crm-web-api';
import { ADAL } from '../_utils/adal';
const eol = require('eol');

@Controller('document')
export class DocumentController {
  constructor(
    private readonly config: ConfigService,
  ) {
    ADAL.ADAL_CONFIG = {
      CRMUrl: this.config.get('CRM_HOST'),
      webAPIurl: this.config.get('CRM_URL_PATH'),
      clientId: this.config.get('CLIENT_ID'),
      clientSecret: this.config.get('CLIENT_SECRET'),
      tenantId: this.config.get('TENANT_ID'),
      authorityHostUrl: this.config.get('AUTHORITY_HOST_URL'),
      tokenPath: this.config.get('TOKEN_PATH'),
    };

    CRMWebAPI.webAPIurl = this.config.get('CRM_URL_PATH');
    CRMWebAPI.CRMUrl = this.config.get('CRM_HOST');
  }

  @Post('/')
  @UseInterceptors(FileInterceptor('file'))
  async index(@UploadedFile() file, @Req() request: Request, @Res() response, @Session() session) {
    if (!session) throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    const {
      body: {
        instanceId,
        entityName
      },
    } = request;

    const headers = {
      MSCRMCallerID: this.config.get('CRM_ADMIN_SERVICE_USER')
    };

    // encode base64
    const encodedBase64File = Buffer.from(file.buffer).toString('base64');

    let uploadDocResponse = {};

    if ( entityName === 'dcp_package' ) {
      const packageGUID = instanceId;

      const packageRecord = (await CRMWebAPI.get(`dcp_packages?$select=dcp_name&$filter=dcp_packageid eq '${packageGUID}'&$top=1`))['value'][0];

      const packageName = packageRecord.dcp_name;

      const folderName = `${packageName}_${packageGUID.replace(/\-/g,'').toUpperCase()}`;

      uploadDocResponse = await CRMWebAPI.uploadDocument('dcp_package', packageGUID, folderName, file.originalname, encodedBase64File, true, headers);
      response.status(200).send({"message": uploadDocResponse});
    } else {
      response.status(400).send({ "error": `You cannot upload files to the entity ${entityName}` });
    }
  }
}
