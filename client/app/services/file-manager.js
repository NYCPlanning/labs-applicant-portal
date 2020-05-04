import ENV from 'client/config/environment';
import fetch from 'fetch';

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
    filesToUpload, // EmberFileUpload Queue Object
  ) {
    this.packageId = packageId;
    this.existingFiles = existingFiles || [];
    this.filesToDelete = filesToDelete || [];
    this.filesToUpload = filesToUpload; // EmberFileUpload QUEUE Object
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
    return Promise.all(this.filesToUpload.files.map((file) => file.upload(`${ENV.host}/documents`, {
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
    })));
  }

  deleteFiles() {
    // Assumes that the backend delivers files each with
    // a unique CRM or sharepoint based ID.
    // TODO: If this is not possible, rework this to be a
    // POST request to a differently named endpoint, like
    // deleteDocument
    return Promise.all(this.filesToDelete.map((file) => fetch(
      `${ENV.host}/documents/${file.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )));
  }

  async save() {
    // See TODO at top of this file.
    await this.uploadFiles();

    await this.deleteFiles();

    this.filesToDelete.clear();
  }
}
