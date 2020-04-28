import ENV from 'client/config/environment';

// This class supports the FileManagement service
export default class FileManager {
  constructor(existingFiles, deleteFiles, uploadFiles) {
    this.existingFiles = existingFiles || [];
    this.deleteFiles = deleteFiles || [];
    this.uploadFiles = uploadFiles;
  }

  markFileForDeletion(existingFile) {
    this.deleteFiles.addObject(existingFile);
    this.existingFiles.removeObject(existingFile);
  }

  unMarkFileForDeletion(deleteFile) {
    this.existingFiles.addObject(deleteFile);
    this.deleteFiles.removeObject(deleteFile);
  }

  deselectFileForUpload(fileToUpload) {
    this.uploadFiles.remove(fileToUpload);
  }

  uploadAllFiles(packageId) {
    return this.uploadFiles.files.map((file) => file.upload(`${ENV.host}/document`, {
      fileKey: 'file',
      withCredentials: true,
      data: {
        instanceId: packageId,
        entityName: 'dcp_package',
      },
    }));
  }

  save() {
    // todo: add promises from deleteFiles()
    return Promise.all(
      this.uploadAllFiles(),
    );
  }
}
