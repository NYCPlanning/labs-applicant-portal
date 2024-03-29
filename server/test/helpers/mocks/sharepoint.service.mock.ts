import { SharepointFile } from 'src/sharepoint/sharepoint.service';

export class SharepointServiceMock {
  async archiveSharepointFolder(folderName: string) {
    return folderName;
  }

  async getSharepointFolderFiles(
    driveId: string,
    folderUrl: string,
  ): Promise<Array<SharepointFile>> {
    return [
      {
        id: driveId,
        name: folderUrl,
        createdDateTime: 'now',
      },
    ];
  }

  async deleteSharepointFile(fileIdPath: string) {
    return fileIdPath;
  }
}
