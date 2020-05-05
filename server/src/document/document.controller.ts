import {
  Controller,
  Post,
  Delete,
  UseInterceptors,
  UploadedFile,
  Session,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { CrmService } from '../crm/crm.service';
import { DocumentService } from './document.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthenticateGuard } from '../authenticate.guard';

@Controller('documents')
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
  // @UseGuards(AuthenticateGuard)
  @Post('/')
  @UseInterceptors(FileInterceptor('file'))
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

    const folderName = `${packageName}_${instanceId.replace(/\-/g,'').toUpperCase()}`;

    return this.documentService.uploadDocument('dcp_package',
      instanceId,
      folderName,
      file.originalname,
      encodedBase64File,
      true,
      headers
    );
  }

   /**
   *  Deletes a file specified by ID from Sharepoint 
   *
   * @param      {String}  documentId  The request body should 
   * of type FormData, have an 'instanceId' property and a
   * 'file' property
   * with the selected file blob.
   * @return     {HTTP Response} Response
   */
  @Delete(':id')
  // @UseGuards(AuthenticateGuard)
  async delete(@Param('id') dockumentId: string, @Session() session) {
    packageId = 'dfa002f2-8fce-e911-a99c-001dd8308076';

    const packageRecord = (await this.crmService.get(
      'dcp_packages',
      `$select=dcp_name&$filter=dcp_packageid eq '${packageId}'&$top=1`)
    );

    const { records: [ { dcp_name: packageName }]} = packageRecord;

    const folderName = `${packageName}_${packageId.replace(/\-/g,'').toUpperCase()}`;

    const headers = {
      // Document will be uploaded as this user
      MSCRMCallerID: this.config.get('CRM_SERVICE_CONTACT_ID'),
    };

    return this.documentService.deleteDocument(
      'dcp_package',
      'dfa002f2-8fce-e911-a99c-001dd8308076',
      folderName,
      'test.txt',
      headers,
    );
  }
}
