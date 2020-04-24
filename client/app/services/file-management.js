import Service from '@ember/service';

function createFileManager(pkg) {
  const { documents } = pkg;
  return {
    existingDocuments: documents,
    deleteDocuments: [],
    uploadDocuments: [],
  };
}

export default class FileManagementService extends Service {
  // A hash of all File Managers in the app.
  // There is one File Manager per editable Package.
  // The key to access a File Manager is the respective
  // package ID.
  fileManagers = {}

  createFileManager(pkg) {
    this.fileManagers[pkg.id] = createFileManager(pkg);
    return this.fileManagers[pkg.id];
  }
}
