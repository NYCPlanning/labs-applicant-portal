import {
  Controller,
  Post,
  Req,
  Res,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  HttpException,
  Session,
  UseGuards
} from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { CrmService } from '../crm/crm.service';
import { DocumentService } from './document.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { AuthenticateGuard } from '../authenticate.guard';

@UseGuards(AuthenticateGuard)
@Controller('document')
export class DocumentController {
  constructor(
    private readonly config: ConfigService,
    private readonly crmService: CrmService,
    private readonly documentService: DocumentService,
) {}

  /**
   *  Upload a file to Sharepoint 
   *
   * @param      {FormData}  request  The request body should 
   * of type FormData, have an 'instanceId' property and a
   * 'file' property
   * with the selected file blob.
   * @return     {HTTP Response} Response
   */
  @Post('/')
  @UseInterceptors(FileInterceptor('file'))
  async index(@UploadedFile() file, @Req() request: Request, @Res() response, @Session() session) {
    const {
      body: {
        instanceId: packageGUID,
      },
    } = request;

    const headers = {
      // Document will be uploaded as this user
      MSCRMCallerID: this.config.get('CRM_SERVICE_CONTACT_ID'),
    };

    let uploadDocResponse = {};

    const encodedBase64File = Buffer.from(file.buffer).toString('base64');

    const packageRecord = (await this.crmService.get(
      'dcp_packages',
      `$select=dcp_name&$filter=dcp_packageid eq '${packageGUID}'&$top=1`)
    );

    const { records: [ { dcp_name: packageName }]} = packageRecord;

    const folderName = `${packageName}_${packageGUID.replace(/\-/g,'').toUpperCase()}`;

    uploadDocResponse = await this.documentService.uploadDocument('dcp_package',
        packageGUID,
        folderName,
        file.originalname,
        encodedBase64File,
        true,
        headers
      );

    response.status(200).send({"message": uploadDocResponse});
  }
}


