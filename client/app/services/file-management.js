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
  fileManagers = {} // REDO: WeakMap? Map?

  findOrCreate(packageId = '', existingFiles = []) {
    if (this.fileManagers[packageId]) {
      return this.fileManagers[packageId];
    }

    return this.registerFileManager(packageId, existingFiles);
  }

  registerFileManager(packageId, existingFiles) {
    const fileQueue = this.fileQueue.create(packageId);

    this.fileManagers[packageId] = new FileManager(
      packageId,
      existingFiles,
      [],
      fileQueue,
    );

    return this.fileManagers[packageId];
  }
}
