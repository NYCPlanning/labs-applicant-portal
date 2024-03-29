import { SharepointFile } from 'src/sharepoint/sharepoint.service';

export class SharepointServiceMock {
  async archiveSharepointFolder(folderName: string) {
    return folderName;
  }

  async getSharepointFolderFiles(
    driveId: string,
    folderIdentifier: string,
  ): Promise<{ value: Array<SharepointFile> }> {
    return {
      value: [
        {
          id: `${driveId}-${folderIdentifier}`,
          name: folderIdentifier,
          createdDateTime: 'now',
        },
      ],
    };
  }

  async getSharepointNestedFolderFiles(
    folderUrl: string,
  ): Promise<Array<SharepointFile>> {
    return [
      {
        id: 'nestedFolderId',
        name: folderUrl,
        createdDateTime: 'now',
      },
    ];
  }

  async deleteSharepointFile(fileIdPath: string) {
    return fileIdPath;
  }
}
