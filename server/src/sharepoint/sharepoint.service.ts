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
      // We obtain artifact and package drive ids their name
      // This is done once on initialization and then the results are reused because the ids are not expected to change
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
    } catch {
      throw new HttpException(
        {
          code: 'ARCHIVE_FOLDER_FAILED',
          title: 'Error archiving sharepoint folder',
          detail: `Error while archiving Sharepoint folder`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Retrieves a list of files in a given Sharepoint folder
  async getSharepointFolderFiles(
    driveId: string,
    folderIdentifier: string,
  ): Promise<{ value: Array<SharepointFile> }> {
    const { accessToken } = await this.msalProvider.getGraphClientToken();

    const urlPackageId = `${this.msalProvider.sharePointSiteUrl}/drives/${driveId}/root:/${folderIdentifier}:/children`;

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    };

    try {
      const response = await fetch(urlPackageId, options);
      const data = (await response.json()) as {
        value: Array<SharepointFile>;
      };
      return data;
    } catch {
      const formattedFolderIdentifier = folderIdentifier.replace("'", "''");
      throw new HttpException(
        {
          code: 'LOAD_FOLDER_FAILED',
          title: 'Error loading sharepoint files',
          detail: `Could not load file list from Sharepoint folder "${formattedFolderIdentifier}".`,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  private async traverseFolders(
    folderName: string,
    driveId: string,
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
    const fileCount = data.value.length;

    for (let i = 0; i < fileCount; i++) {
      const entry = data.value[i];
      if (entry.file !== undefined) {
        documents.push(entry);
      } else if (entry.folder?.childCount > 0) {
        documents = documents.concat(
          await this.traverseFolders(
            `${folderName}/${entry.name}`,
            driveId,
            accessToken,
          ),
        );
      }
    }
    return documents;
  }

  // Use for artifacts
  async getSharepointNestedFolderFiles(
    folderUrl: string,
  ): Promise<Array<SharepointFile>> {
    try {
      const { accessToken } = await this.msalProvider.getGraphClientToken();

      const [, folderName] = folderUrl.split('dcp_artifacts/');
      const artifactDriveId = this.artifactDriveId;
      return await this.traverseFolders(
        folderName,
        artifactDriveId,
        accessToken,
      );
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

    // this returns a pipeable stream
    return Request.get(options).on('error', (e) => console.log(e));
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

    const response = await fetch(url, options);
    return response;
  }
}
