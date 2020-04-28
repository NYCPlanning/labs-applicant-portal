import ENV from 'client/config/environment';

export default class FileManager {
  constructor(existingFiles, deleteFiles, uploadFiles) {
    this.existingFiles = existingFiles || [];
    this.deleteFiles = deleteFiles || [];
    this.uploadFiles = uploadFiles;
  }

  deleteFile(existingFile) {
    this.deleteFiles.addObject(existingFile);
    this.existingFiles.removeObject(existingFile);
  }

  undoDeleteFile(deleteFile) {
    this.existingFiles.addObject(deleteFile);
    this.deleteFiles.removeObject(deleteFile);
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
