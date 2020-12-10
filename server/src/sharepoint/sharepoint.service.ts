import {
  HttpException,
  HttpStatus,
  Injectable
} from '@nestjs/common';
import * as Request from 'request';
import { ConfigService } from '../config/config.service';

// This service currently only helps you read and delete files from Sharepoint.
// If you wish to upload documents to Sharepoint through CRM,
// use the DocumentService instead.
@Injectable()
export class SharepointService {
  constructor(
    private readonly config: ConfigService,
  ) {}

  async generateSharePointAccessToken(): Promise<any> {
    const TENANT_ID = this.config.get('TENANT_ID');
    const SHAREPOINT_CLIENT_ID = this.config.get('SHAREPOINT_CLIENT_ID');
    const SHAREPOINT_CLIENT_SECRET = this.config.get('SHAREPOINT_CLIENT_SECRET');
    const ADO_PRINCIPAL = this.config.get('ADO_PRINCIPAL');
    const SHAREPOINT_TARGET_HOST = this.config.get('SHAREPOINT_TARGET_HOST');

    const clientId = `${SHAREPOINT_CLIENT_ID}@${TENANT_ID}`;
    const data = `
      grant_type=client_credentials
      &client_id=${clientId}
      &client_secret=${SHAREPOINT_CLIENT_SECRET}
      &resource=${ADO_PRINCIPAL}/${SHAREPOINT_TARGET_HOST}@${TENANT_ID}
    `;

    const options = {
      url: `https://accounts.accesscontrol.windows.net/${TENANT_ID}/tokens/OAuth/2`,
      headers: {
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/x-www-form-urlencoded',
        'OData-MaxVersion': '4.0',
        'OData-Version': '4.0',
        Accept: 'application/json',
        Prefer: 'return=representation',
      },
      body: data,
      encoding: null,
    };

    return new Promise(resolve => {
      Request.get(options, (error, response, body) => {
        const stringifiedBody = body.toString('utf-8');
        if (response.statusCode >= 400) {
          console.log('error', stringifiedBody);
        }

        resolve(JSON.parse(stringifiedBody));
      });
    })
  }

  // Retrieves a list of files in a given Sharepoint folder
  async getSharepointFolderFiles(folderIdentifier): Promise<any> {
    try {
      const { access_token } = await this.generateSharePointAccessToken();
      const SHAREPOINT_CRM_SITE = this.config.get('SHAREPOINT_CRM_SITE');

      // Escape apostrophes by duplicating any apostrophes.
      // See https://sharepoint.stackexchange.com/a/165224
      const formattedFolderIdentifier = folderIdentifier.replace("'", "''");
      const url = encodeURI(`https://nyco365.sharepoint.com/sites/${SHAREPOINT_CRM_SITE}/_api/web/GetFolderByServerRelativeUrl('/sites/${SHAREPOINT_CRM_SITE}/${formattedFolderIdentifier}')/Files`);

      const options = {
        url,
        headers: {
          'Authorization': `Bearer ${access_token}`,
          Accept: 'application/json',
        },
      };

      return new Promise(resolve => {
        Request.post(options, (error, response, body) => {
          const stringifiedBody = body.toString('utf-8');
          if (response.statusCode >= 400) {
            throw new HttpException({
              code: 'LOAD_FOLDER_FAILED',
              title: 'Error loading sharepoint files',
              detail: `Could not load file list from Sharepoint folder "${formattedFolderIdentifier}". ${stringifiedBody}`,
            }, HttpStatus.NOT_FOUND);;
          }

          resolve(JSON.parse(stringifiedBody));
        });
      })
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      } else {
        throw new HttpException({
          code: 'REQUEST_FOLDER_FAILED',
          title: 'Error requesting sharepoint files',
          detail: `Error while constructing request for Sharepoint folder files`,
        }, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async getSharepointFile(serverRelativeUrl): Promise<any> {
    const { access_token } = await this.generateSharePointAccessToken();
    const SHAREPOINT_CRM_SITE = this.config.get('SHAREPOINT_CRM_SITE');

    // see https://docs.microsoft.com/en-us/previous-versions/office/sharepoint-server/dn775742(v=office.15)
    const url = `https://nyco365.sharepoint.com/sites/${SHAREPOINT_CRM_SITE}/_api/web/GetFileByServerRelativeUrl('/${serverRelativeUrl}')/$value?binaryStringResponseBody=true`;

    const options = {
      url,
      headers: {
        'Authorization': `Bearer ${access_token}`,
      },
    };

    // this returns a pipeable stream
    return Request.get(options)
      .on('error', (e) => console.log(e));
  }

  async deleteSharepointFile(serverRelativeUrl): Promise<any> {
    const { access_token } = await this.generateSharePointAccessToken();
    const SHAREPOINT_CRM_SITE = this.config.get('SHAREPOINT_CRM_SITE');
    const url = `https://nyco365.sharepoint.com/sites/${SHAREPOINT_CRM_SITE}/_api/web/GetFileByServerRelativeUrl('${serverRelativeUrl}')`;

    const options = {
      url,
      headers: {
        'Authorization': `Bearer ${access_token}`,
        Accept: 'application/json',
        'X-HTTP-Method': 'DELETE',
      },
    };

    return new Promise(resolve => {
      Request.del(options, (error, response, body) => {
        const stringifiedBody = body.toString('utf-8');
        if (response.statusCode >= 400) {
          console.log('error', stringifiedBody);
        }

        resolve();
      });
    })
  }
}