import Service, { inject as service } from '@ember/service';
import FileManager from './file-manager';

export default class FileManagementService extends Service {
  @service
  fileQueue;

  // A hash of all File Managers in the app.
  // There is one File Manager per editable Package.
  // The key to access a File Manager is the respective
  // package ID.
  // REDO: Look into managing this through Package models
  fileManagers = {}

  createFileManager(
    id = '',
    existingFiles = [],
  ) {
    this.fileManagers[id] = new FileManager(
      existingFiles,
      [],
      this.fileQueue.create(id),
    );

    return this.fileManagers[id];
  }
}
