import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import Request from 'request';
import { MSAL, MsalProviderType } from 'src/provider/msal.provider';

export type SharePointListDrive = {
  name: string;
  drive: {
    id: string;
  };
};
export type SharepointFile = {
  id: string;
  name: string;
  createdDateTime: string;
  file?: {
    mimeType: string;
  };
  folder?: {
    childCount: number;
  };
};

// This service currently only helps you read and delete files from Sharepoint.
// If you wish to upload documents to Sharepoint through CRM,
// use the DocumentService instead.
@Injectable()
export class SharepointService {
  constructor(
    @Inject(MSAL)
    private readonly msalProvider: MsalProviderType,
  ) {
    (async () => {
      const { accessToken } = await msalProvider.getGraphClientToken();
      // Files are only accessible when their parent drive id is known.
      // We obtain artifact and package drive ids by their name
      // The ids are not expected to change. So, we can set them once on initialization and then reuse the results
      const getDriveIdRequestUrl = (listDisplayName: string) =>
        `${msalProvider.sharePointSiteUrl}/lists?$filter=displayName eq '${listDisplayName}'&$expand=drive($select=id)&$select=name`;
      const artifactDriveIdRequestUrl = getDriveIdRequestUrl('Artifact');
      const packageDriveIdRequestUrl = getDriveIdRequestUrl('Package');

      const options = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
      };
      try {
        // The responses are not awaited because they should not block each other.
        fetch(artifactDriveIdRequestUrl, options).then((response) =>
          response
            .json()
            .then((data: { value: Array<SharePointListDrive> }) => {
              const {
                drive: { id },
              } = data.value[0];
              this.artifactDriveId = id;
            }),
        );
        fetch(packageDriveIdRequestUrl, options).then((response) =>
          response
            .json()
            .then((data: { value: Array<SharePointListDrive> }) => {
              const {
                drive: { id },
              } = data.value[0];
              this.packageDriveId = id;
            }),
        );
      } catch {
        throw new HttpException(
          {
            code: 'INITIALIZE_DRIVE_ID',
            title: 'Error initializing sharepoint drive ids',
            detail: 'Could not retrieve ids for sharepoint drives',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    })();
  }
  artifactDriveId: string;
  packageDriveId: string;

  // This function renames the folder specified by `folderName` by appending `dcp_archived` to the end of its name
  // Example of folderName: `2021M023_Draft LU Form_3_A234234ASFLKNF3423`
  async archiveSharepointFolder(folderName: string): Promise<any> {
    const newName = `${folderName}/_dcp_archived`;
    const url = `${this.msalProvider.sharePointSiteUrl}/drives/${this.packageDriveId}/root:/${folderName}`;
    const body = {
      name: newName,
    };
    const options = {
      method: 'PATCH',
      body: JSON.stringify(body),
    };
    try {
      const response = await fetch(url, options);
      return response.json();
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

  private async traverseFolders(
    driveId: string,
    folderName: string,
    accessToken: string,
  ): Promise<Array<SharepointFile>> {
    const url = `${this.msalProvider.sharePointSiteUrl}/drives/${driveId}/root:/${folderName}:/children?$select=id,name,file,folder,createdDateTime`;
    const options = {
      headers: {
        method: 'GET',
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    };
    const response = await fetch(url, options);
    const data = (await response.json()) as {
      value: Array<SharepointFile>;
    };
    let documents: Array<SharepointFile> = [];
    // Create a promise for each folder that needs to be search,
    // allowing child folders to be search simultaneously
    const pendingDocuments: Array<Promise<SharepointFile[]>> = [];
    const fileCount = data.value.length;

    for (let i = 0; i < fileCount; i++) {
      const entry = data.value[i];
      if (entry.file !== undefined) {
        documents.push(entry);
      } else if (entry.folder?.childCount > 0) {
        pendingDocuments.push(
          this.traverseFolders(
            driveId,
            `${folderName}/${entry.name}`,
            accessToken,
          ),
        );
      }
    }
    const resolvedDocuments = await Promise.all(pendingDocuments);
    const resolvedDocumentsCount = resolvedDocuments.length;
    for (let i = 0; i < resolvedDocumentsCount; i++) {
      documents = documents.concat(resolvedDocuments[i]);
    }
    return documents;
  }

  // Use for artifacts
  async getSharepointFolderFiles(
    driveId: string,
    folderName: string,
  ): Promise<Array<SharepointFile>> {
    const { accessToken } = await this.msalProvider.getGraphClientToken();

    try {
      return await this.traverseFolders(driveId, folderName, accessToken);
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
    const { accessToken } = await this.msalProvider.getGraphClientToken();

    const url = `${this.msalProvider.sharePointSiteUrl}/drives/${this.packageDriveId}/items/${fileId}/content`;
    const options = {
      url,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    };

    try {
      // this returns a pipeable stream
      return Request.get(options);
    } catch {
      throw new HttpException(
        {
          code: 'DOWNLOAD_FILE_FAILED',
          title: 'Error downloading sharepoint file',
          detail: `Error while downloading Sharepoint file`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteSharepointFile(fileIdPath: string): Promise<any> {
    const { accessToken } = await this.msalProvider.getGraphClientToken();
    // Note the lack of slash after "items". This is because the calling controller historically accepted a relative file path.
    // The request is now based on file id. However, it still passes a preceding slash because of its past structure.
    const url = `${this.msalProvider.sharePointSiteUrl}/drives/${this.packageDriveId}/items${fileIdPath}`;

    const options = {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    };

    try {
      const response = await fetch(url, options);
      return response;
    } catch {
      throw new HttpException(
        {
          code: 'DELETE_FILE_FAILED',
          title: 'Error deleting sharepoint file',
          detail: `Error while deleting Sharepoint file`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
