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
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { CrmService } from '../crm/crm.service';
import { DocumentService } from './document.service';
import { SharepointService } from '../sharepoint/sharepoint.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthenticateGuard } from '../authenticate.guard';

const MAX_FILESIZE_BYTES = 99999999;

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
  @Post('/package/')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthenticateGuard)
  async postPackageDocument(
    @UploadedFile() file,
    @Body('instanceId') instanceId,
  ) {
    if (file.size > MAX_FILESIZE_BYTES) {
      throw new HttpException(
        'File size too large',
        HttpStatus.PAYLOAD_TOO_LARGE,
      );
    }

    const headers = {
      // Document will be uploaded as this user
      MSCRMCallerID: this.config.get('CRM_SERVICE_CONTACT_ID'),
    };

    const encodedBase64File = Buffer.from(file.buffer).toString('base64');

    const packageRecord = await this.crmService.get(
      'dcp_packages',
      `$select=dcp_name&$filter=dcp_packageid eq '${instanceId}'&$top=1`,
    );

    const {
      records: [{ dcp_name: packageName }],
    } = packageRecord;

    // We upload documents to the Sharepoint folder that holds documents from
    // previous revisions. This way, the revision folder holds both documents
    // from current and past revisions. When retrieving documents, we can then
    // only look up this one folder, instead of two separate folders (one for
    // previous revision documents and one for current revision documents).
    const folderName = `${packageName}_${instanceId.toUpperCase().replace(/-/g, '')}`;

    const strippedFileName = file.originalname.replace(/[^-a-zA-Z0-9._]/g, '-');

    return this.documentService.uploadDocument(
      'dcp_package',
      instanceId,
      folderName,
      strippedFileName,
      encodedBase64File,
      true,
      headers,
    );
  }

  // instandId - project artifact id
  //  @UseGuards(AuthenticateGuard)
  @Post('/artifact/')
  @UseInterceptors(FileInterceptor('file'))
  async postArtifactDocument(
    @UploadedFile() file,
    @Body('instanceId') instanceId,
  ) {
    if (file.size > MAX_FILESIZE_BYTES) {
      throw new HttpException(
        'File size too large',
        HttpStatus.PAYLOAD_TOO_LARGE,
      );
    }

    const headers = {
      // Document will be uploaded as this user
      MSCRMCallerID: this.config.get('CRM_SERVICE_CONTACT_ID'),
    };

    const encodedBase64File = Buffer.from(file.buffer).toString('base64');

    const artifactRecord = await this.crmService.get(
      'dcp_artifactses',
      `$select=dcp_name&$filter=dcp_artifactsid eq '${instanceId}'&$top=1`,
    );

    const {
      records: [{ dcp_name: artifactName }],
    } = artifactRecord;

    const folderName = `${artifactName}_${instanceId.toUpperCase().replace(/-/g, '')}`;

    const strippedFileName = file.originalname.replace(/[^-a-zA-Z0-9._]/g, '-');

    return this.documentService.uploadDocument(
      'dcp_artifacts',
      instanceId,
      folderName,
      strippedFileName,
      encodedBase64File,
      true,
      headers,
    );
  }

  @Delete('/')
  @HttpCode(204)
  @UseGuards(AuthenticateGuard)
  async destroy(@Query('serverRelativeUrl') serverRelativeUrl: string) {
    return this.sharepointService.deleteSharepointFile(serverRelativeUrl);
  }

  // Historically this endpoint accepted a relative file path.
  // It now accepts the file id. However, upstream references may
  // use `serverRelativeUrl` convention because of this historical use.
  @Get('/:id')
  async read(@Param() params: { id: string }, @Res() res) {
    const { id: fileId } = params;
    const stream = await this.sharepointService.getSharepointFile(fileId);

    stream.pipe(res);
  }
}
