import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Session,
  Body,
  UseGuards,
  Delete,
  Query,
  HttpCode,
  Param,
  Get,
  Res,
} from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { CrmService } from '../crm/crm.service';
import { DocumentService } from './document.service';
import { SharepointService } from '../sharepoint/sharepoint.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthenticateGuard } from '../authenticate.guard';

@Controller('documents')
export class DocumentController {
  constructor(
    private readonly config: ConfigService,
    private readonly crmService: CrmService,
    private readonly documentService: DocumentService,
    private readonly sharepointService: SharepointService,
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
  @UseGuards(AuthenticateGuard)
  async create(@UploadedFile() file, @Body('instanceId') instanceId, @Session() session) {
    const headers = {
      // Document will be uploaded as this user
      MSCRMCallerID: this.config.get('CRM_SERVICE_CONTACT_ID'),
    };

    const encodedBase64File = Buffer.from(file.buffer).toString('base64');

    const packageRecord = (await this.crmService.get(
      'dcp_packages',
      `$select=dcp_name&$filter=dcp_packageid eq '${instanceId}'&$top=1`)
    );

    const { records: [ { dcp_name: packageName }]} = packageRecord;

    // We upload documents to the Sharepoint folder that holds documents from
    // previous revisions. This way, the revision folder holds both documents
    // from current and past revisions. When retrieving documents, we can then
    // only look up this one folder, instead of two separate folders (one for
    // previous revision documents and one for current revision documents).
    const folderName = `${packageName}_${instanceId.toUpperCase().replace(/-/g, '')}`;

    return this.documentService.uploadDocument('dcp_package',
      instanceId,
      folderName,
      file.originalname,
      encodedBase64File,
      true,
      headers
    );
  }

  @Delete('/')
  @HttpCode(204)
  @UseGuards(AuthenticateGuard)
  async destroy(@Query('serverRelativeUrl') serverRelativeUrl) {
    return this.sharepointService.deleteSharepointFile(serverRelativeUrl);
  }

  // "path" refers to the "relative server path", the path
  // to the file itself on the sharepoint host. for example,
  // /sites/dcpuat2/.../filename.png
  @Get('/*')
  async read(@Param() path, @Res() res) {
    const pathSegment = path[0];
    const stream = await this.sharepointService.getSharepointFile(pathSegment);

    stream.pipe(res);
  }
}
