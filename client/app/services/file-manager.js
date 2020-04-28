import ENV from 'client/config/environment';

// This class supports the FileManagement service
export default class FileManager {
  constructor(existingFiles, filesToDelete, filesToUpload) {
    this.existingFiles = existingFiles || [];
    this.filesToDelete = filesToDelete || [];
    this.filesToUpload = filesToUpload;
  }

  markFileForDeletion(existingFile) {
    this.filesToDelete.addObject(existingFile);
    this.existingFiles.removeObject(existingFile);
  }

  unMarkFileForDeletion(deleteFile) {
    this.existingFiles.addObject(deleteFile);
    this.filesToDelete.removeObject(deleteFile);
  }

  deselectFileForUpload(fileToUpload) {
    this.filesToUpload.remove(fileToUpload);
  }

  uploadFiles(packageId) {
    return this.filesToUpload.files.map((file) => file.upload(`${ENV.host}/document`, {
      fileKey: 'file',
      withCredentials: true,
      data: {
        instanceId: packageId,
        entityName: 'dcp_package',
      },
    }));
  }

  save() {
    // todo: add promises from filesToDelete()
    return Promise.all(
      this.uploadFiles(),
    );
  }
}
