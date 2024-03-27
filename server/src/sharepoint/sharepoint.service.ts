import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import Request from 'request';
import { ConfigService } from '../config/config.service';
import { MSAL, MsalProviderType } from 'src/provider/msal.provider';

function unnest(folders = []) {
  return folders
    .map((folder) => {
      return [...folder['Files'], ...unnest(folder['Folders'])];
    })
    .reduce((acc, curr) => {
      return acc.concat(curr);
    }, []);
}

export type SharepointFolderFiles = {
  Name: string;
  TimeCreated: string;
  ServerRelativeUrl: string;
  'odata.type': string;
};

export type SharepointFolderFilesGraph = {
  id: string,
  name: string;
  createdDateTime: string;
  webUrl: string;
};

// This service currently only helps you read and delete files from Sharepoint.
// If you wish to upload documents to Sharepoint through CRM,
// use the DocumentService instead.
@Injectable()
export class SharepointService {
  constructor(
    @Inject(MSAL)
    private readonly msalProvider: MsalProviderType,

    private readonly config: ConfigService,
  ) {}

  async generateSharePointAccessTokenGraph() {
    const response = await this.msalProvider.cca.acquireTokenByClientCredential(
      {
        scopes: this.msalProvider.scopes,
      },
    );
    const { accessToken: accessTokenGraph } = response;
    return { accessTokenGraph };
  }

  async generateSharePointAccessToken(): Promise<{ access_token: string }> {
    const TENANT_ID = this.config.get('TENANT_ID');
    const SHAREPOINT_CLIENT_ID = this.config.get('SHAREPOINT_CLIENT_ID');
    const SHAREPOINT_CLIENT_SECRET = this.config.get(
      'SHAREPOINT_CLIENT_SECRET',
    );
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

    return new Promise((resolve) => {
      Request.get(options, (error, response, body) => {
        const stringifiedBody = body.toString('utf-8');
        if (response.statusCode >= 400) {
          console.log('error', stringifiedBody);
        }

        resolve(JSON.parse(stringifiedBody));
      });
    });
  }

  async getSharepointDigestInfo(): Promise<any> {
    try {
      const { access_token } = await this.generateSharePointAccessToken();
      const SHAREPOINT_CRM_SITE = this.config.get('SHAREPOINT_CRM_SITE');

      const url = encodeURI(
        `https://nyco365.sharepoint.com/sites/${SHAREPOINT_CRM_SITE}/_api/contextinfo`,
      );

      const options = {
        url,
        headers: {
          Authorization: `Bearer ${access_token}`,
          Accept: 'application/json',
        },
      };

      return new Promise((resolve) => {
        Request.post(options, (error, response, body) => {
          const stringifiedBody = body.toString('utf-8');
          if (response.statusCode >= 400) {
            throw new HttpException(
              {
                code: 'GET_DIGEST_FAILED',
                title: 'Error getting sharepoint digest',
                detail: `Could not get digest`,
              },
              HttpStatus.NOT_FOUND,
            );
          }

          console.debug('get sharepoint digest', JSON.parse(stringifiedBody));
          resolve(JSON.parse(stringifiedBody));
        });
      });
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      } else {
        throw new HttpException(
          {
            code: 'GET_DIGEST_FAILED',
            title: 'Error getting sharepoint digest',
            detail: `Could not get digest`,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async getSharepointFolderInfo(folderIdentifier: string): Promise<any> {
    try {
      const { access_token } = await this.generateSharePointAccessToken();
      const SHAREPOINT_CRM_SITE = this.config.get('SHAREPOINT_CRM_SITE');

      const formattedFolderIdentifier = folderIdentifier.replace("'", "''");
      const url = encodeURI(
        `https://nyco365.sharepoint.com/sites/${SHAREPOINT_CRM_SITE}/_api/web/GetFolderByServerRelativeUrl('/sites/${SHAREPOINT_CRM_SITE}/${formattedFolderIdentifier}')/ListItemAllFields`,
      );

      const options = {
        url,
        headers: {
          Authorization: `Bearer ${access_token}`,
          Accept: 'application/json',
        },
      };

      return new Promise((resolve) => {
        Request.post(options, (error, response, body) => {
          const stringifiedBody = body.toString('utf-8');
          if (response.statusCode >= 400) {
            throw new HttpException(
              {
                code: 'GET_FOLDER_INFO_FAILED',
                title: 'Error getting folder info',
                detail: `Could not load info on Sharepoint folder "${formattedFolderIdentifier}". ${stringifiedBody}`,
              },
              HttpStatus.NOT_FOUND,
            );
          }

          console.debug('get sharepoint folder info', stringifiedBody);
          resolve(JSON.parse(stringifiedBody));
        });
      });
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      } else {
        throw new HttpException(
          {
            code: 'GET_FOLDER_INFO_FAILED',
            title: 'Error requesting sharepoint folder info',
            detail: `Error while constructing request for Sharepoint folder info`,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // This function renames the folder specified by `folderIdentifier` by appending `dcp_archived` to the end of its name
  // Example of folderIdentifier: `dcp_package/2021M023_Draft LU Form_3_A234234ASFLKNF3423`
  async archiveSharepointFolder(folderIdentifier: string): Promise<any> {
    const { 'odata.type': folderOdataType } =
      await this.getSharepointFolderInfo(folderIdentifier);

    const { FormDigestValue: formDigest } =
      await this.getSharepointDigestInfo();

    const newName =
      folderIdentifier.replace('dcp_package/', '') + '_dcp_archived';

    try {
      const { access_token } = await this.generateSharePointAccessToken();
      const SHAREPOINT_CRM_SITE = this.config.get('SHAREPOINT_CRM_SITE');

      const formattedFolderIdentifier = folderIdentifier.replace("'", "''");
      const url = encodeURI(
        `https://nyco365.sharepoint.com/sites/${SHAREPOINT_CRM_SITE}/_api/web/GetFolderByServerRelativeUrl('/sites/${SHAREPOINT_CRM_SITE}/${formattedFolderIdentifier}')/ListItemAllFields`,
      );

      const postBody = JSON.stringify({
        __metadata: {
          type: folderOdataType,
        },
        Title: newName,
        FileLeafRef: newName,
      });

      const options = {
        url,
        headers: {
          Authorization: `Bearer ${access_token}`,
          Accept: 'application/json;odata=verbose',
          'Content-Type': 'application/json;odata=verbose',
          'Content-Length': postBody.length,
          'If-Match': '*',
          'X-HTTP-Method': 'MERGE',
          'X-RequestDigest': formDigest,
        },
        body: postBody,
      };

      return new Promise((resolve) => {
        Request.post(options, (error, response, body) => {
          const stringifiedBody = body.toString('utf-8');
          if (response.statusCode >= 400) {
            throw new HttpException(
              {
                code: 'ARCHIVE_FOLDER_FAILED',
                title: 'Error archiving existing folder',
                detail: `Could not archive Sharepoint folder "${formattedFolderIdentifier}". ${stringifiedBody}`,
              },
              HttpStatus.NOT_FOUND,
            );
          }

          console.debug('archive sharepoint folder', stringifiedBody);
          resolve(stringifiedBody);
        });
      });
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      } else {
        throw new HttpException(
          {
            code: 'ARCHIVE_FOLDER_FAILED',
            title: 'Error archiving existing folder',
            detail: `Error while constructing request to archive Sharepoint folder`,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // Retrieves a list of files in a given Sharepoint folder
  async getSharepointFolderFiles(
    driveId: string,
    folderIdentifier: string,
  ): Promise<{ value: Array<SharepointFolderFilesGraph> }> {
    const { accessTokenGraph } =
      await this.generateSharePointAccessTokenGraph();

    const urlPackageIdGraph = `${this.msalProvider.sharePointSiteUrl}/drives/${driveId}/root:/${folderIdentifier}:/children`;
    console.debug('graph url', urlPackageIdGraph);

    const optionsGraph = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessTokenGraph}`,
      },
    };

    try {
      const responseGraph = await fetch(urlPackageIdGraph, optionsGraph);
      const dataGraph = (await responseGraph.json()) as {
        value: Array<SharepointFolderFilesGraph>;
      };
      console.debug('dataGraph', dataGraph);
      return dataGraph;
    } catch (e) {
      console.error('graph error', e);
      const formattedFolderIdentifier = folderIdentifier.replace("'", "''");
      throw new HttpException(
        {
          code: 'LOAD_FOLDER_FAILED',
          title: 'Error loading sharepoint files (Graph)',
          detail: `Could not load file list from Sharepoint folder "${formattedFolderIdentifier}".`,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  // Use for artifacts
  async getSharepointNestedFolderFiles(
    folderIdentifier,
    path = 'Files',
    method = 'post',
  ): Promise<any> {
    try {
      const { access_token } = await this.generateSharePointAccessToken();

      // For Artifacts, folderIdentifier is an absolute URL instead of a relative url, so we extract it
      // by spltting folderIdentifier with the environment token (e.g. 'dcppfsuat2')
      const SHAREPOINT_CRM_SITE = this.config.get('SHAREPOINT_CRM_SITE');
      let [, relativeUrl] = folderIdentifier.split(SHAREPOINT_CRM_SITE);

      // If there's no relative url extracted, it means folderIdentifier was
      // a true relative url (from a Package) to begin with. So we
      // use the original folderIdentifier
      if (!relativeUrl) {
        relativeUrl = folderIdentifier;
      }

      const url = encodeURI(
        `https://nyco365.sharepoint.com/sites/${SHAREPOINT_CRM_SITE}/_api/web/GetFolderByServerRelativeUrl('/sites/${SHAREPOINT_CRM_SITE}/${relativeUrl}')/${path}`,
      );
      const options = {
        url,
        headers: {
          Authorization: `Bearer ${access_token}`,
          Accept: 'application/json',
        },
      };

      return new Promise((resolve, reject) => {
        Request[method](options, (error, response, body) => {
          if (error) return;
          const stringifiedBody = body.toString('utf-8');
          if (response.statusCode >= 400) {
            reject(
              new HttpException(
                {
                  code: 'LOAD_FOLDER_FAILED',
                  title: 'Error loading sharepoint files',
                  detail: `Could not load file list from Sharepoint folder "${url}". ${stringifiedBody}`,
                },
                HttpStatus.NOT_FOUND,
              ),
            );
          }
          const folderFiles = JSON.parse(stringifiedBody);

          console.debug('sharepoint nested folder files', stringifiedBody);
          resolve([
            ...(folderFiles['Files'] ? folderFiles['Files'] : []),
            ...(folderFiles['Folders'] ? unnest(folderFiles['Folders']) : []),
          ]);
        });
      });
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      } else {
        throw new HttpException(
          {
            code: 'REQUEST_FOLDER_FAILED',
            title: 'Error requesting sharepoint files',
            detail: `Error while constructing request for Sharepoint folder files`,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async getSharepointFile(fileId: string): Promise<any> {
    const { accessTokenGraph: accessToken } =
      await this.generateSharePointAccessTokenGraph();
    const packageDriveId = this.config.get("SHAREPOINT_PACKAGE_ID_GRAPH")

    const url = `${this.msalProvider.sharePointSiteUrl}/drives/${packageDriveId}/items/${fileId}/content`;
    const options = {
      url,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    // this returns a pipeable stream
    return Request.get(options).on('error', (e) => console.log(e));
  }

  async deleteSharepointFile(serverRelativeUrl): Promise<any> {
    const { access_token } = await this.generateSharePointAccessToken();
    const SHAREPOINT_CRM_SITE = this.config.get('SHAREPOINT_CRM_SITE');
    const url = `https://nyco365.sharepoint.com/sites/${SHAREPOINT_CRM_SITE}/_api/web/GetFileByServerRelativeUrl('${serverRelativeUrl}')`;

    const options = {
      url,
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: 'application/json',
        'X-HTTP-Method': 'DELETE',
      },
    };

    console.log('delete sharepoint file request', options);
    return new Promise((resolve) => {
      Request.del(options, (error, response, body) => {
        const stringifiedBody = body.toString('utf-8');
        if (response.statusCode >= 400) {
          console.log('error', stringifiedBody);
        }

        resolve(undefined);
      });
    });
  }
}
