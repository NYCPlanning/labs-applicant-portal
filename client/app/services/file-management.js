import Service from '@ember/service';

export default class FileManagementService extends Service {
  // A hash of all File Managers in the app.
  // There is one File Manager per editable Package.
  // The key to access a File Manager is the respective
  // package ID.
  fileManagers = {}

  createFileManager(
    id = '',
    existingDocuments = [],
    deleteDocuments = [],
    uploadDocuments = [],
  ) {
    this.fileManagers[id] = {
      existingDocuments,
      deleteDocuments,
      uploadDocuments,
    };

    return this.fileManagers[id];
  }
}
