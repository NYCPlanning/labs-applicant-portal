import ENV from 'client/config/environment';
import fetch from 'fetch';
import { tracked } from '@glimmer/tracking';

// This class supports the FileManagement service
export default class FileManager {
  constructor(
    recordId,
    entityType,
    existingFiles,
    filesToDelete,
    filesToUpload, // EmberFileUpload Queue Object
    session,
  ) {
    console.assert(
      entityType === 'package' || entityType === 'artifact',
      "entityType must be 'package' or 'artifact'",
    );

    this.recordId = recordId;
    this.entityType = entityType;
    this.existingFiles = existingFiles || [];
    this.filesToDelete = filesToDelete || [];
    this.filesToUpload = filesToUpload; // EmberFileUpload QUEUE Object
    this.session = session;
  }

  @tracked existingFiles;

  @tracked filesToDelete;

  // This is not ideal, but we need to manually track
  // number of uploaded files because we can't open
  //  up ember-file-upload's fileQueue object and
  // designate the `files` array as @tracked.
  // i.e. we can't designate at this.fileToUpload as
  // @tracked. The isDirty() getter is flakey if
  // depending on this.fileToUpload
  @tracked numFilesToUpload = 0;

  get isDirty() {
    const hasUpload = this.numFilesToUpload > 0;
    const hasDelete = this.filesToDelete.length > 0;

    return hasUpload || hasDelete;
  }

  markFileForDeletion(existingFile) {
    this.filesToDelete.addObject(existingFile);
    this.existingFiles.removeObject(existingFile);
  }

  unMarkFileForDeletion(deleteFile) {
    this.existingFiles.addObject(deleteFile);
    this.filesToDelete.removeObject(deleteFile);
  }

  trackFileForUpload() {
    this.numFilesToUpload += 1;
  }

  deselectFileForUpload(fileToUpload) {
    this.filesToUpload.remove(fileToUpload);
    this.numFilesToUpload -= 1;
  }

  async uploadFiles(instanceId = this.recordId) {
    for (let i = 0; i < this.filesToUpload.files.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await this.filesToUpload.files[i].upload(
        `${ENV.host}/documents/${this.entityType}`,
        {
          // eslint-disable-line
          fileKey: 'file',
          headers: {
            Authorization: `Bearer ${this.session.data.authenticated.access_token}`,
          },
          data: {
            instanceId,
            entityName:
              this.entityType === 'artifact' ? 'dcp_artifacts' : 'dcp_package',
          },
        },
      );
    }
  }

  deleteFiles() {
    // Assumes that the backend delivers files each with
    // a unique CRM or sharepoint based ID.
    // TODO: If this is not possible, rework this to be a
    // POST request to a differently named endpoint, like
    // deleteDocument
    return Promise.all(
      this.filesToDelete.map((file) => fetch(
        `${ENV.host}/documents?serverRelativeUrl=${file.serverRelativeUrl}`,
        {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.session.data.authenticated.access_token}`,
          },
        },
      )),
    );
  }

  async save(instanceId) {
    // See TODO at top of this file.
    await this.uploadFiles(instanceId);

    await this.deleteFiles();

    this.filesToDelete.clear();

    this.numFilesToUpload = 0;
  }
}
