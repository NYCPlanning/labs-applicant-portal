import ENV from 'client/config/environment';

// This class supports the FileManagement service
// TODO: We need to handle rehydrating the existingFiles.
// After the app calls fileManager.save(), the Package
// model should have new associated documents.
// We need to re-request the package with associated documents
// and rehydrate existhingFiles.
export default class FileManager {
  constructor(
    packageId,
    existingFiles,
    filesToDelete,
    filesToUpload,
  ) {
    this.packageId = packageId;
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

  uploadFiles() {
    return this.filesToUpload.files.map((file) => file.upload(`${ENV.host}/document`, {
      fileKey: 'file',
      withCredentials: true,
      data: {
        instanceId: this.packageId,
        // Todo: `entityName` shouldn't be necessary.
        // In this application, documents should only be
        // uploaded to packages (at least so far).
        // remove `entityName` after deprecating it from the backend
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
