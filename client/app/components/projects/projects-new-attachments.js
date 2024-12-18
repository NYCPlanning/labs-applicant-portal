import Component from '@glimmer/component';
import { action } from '@ember/object';
import validateFileUpload from '../../validators/validate-file-presence';

/**
 * This component wires a fileManager to the attachments UI.
 * @param      {Artifact Model}  artifact
 */
export default class ProjectsNewAttachmentsComponent extends Component {
  get fileManager() {
    // should be an instance of FileManager
    return this.args.fileManager;
  }

  @action
  markFileForDeletion(file) {
    this.fileManager.markFileForDeletion(file);

    this.args.package.documents = this.fileManager.existingFiles;
  }

  @action
  unmarkFileForDeletion(file) {
    this.fileManager.unMarkFileForDeletion(file);
  }

  // This action doesn't perform any file selection.
  // That part is automatically handled by the
  // ember-file-upload addon.
  // Here we manually increment the number of files to
  // upload to update the fileManager isDirty state.
  @action
  trackFileForUpload() {
    this.fileManager.trackFileForUpload();
    this.args.package.documents = [
      ...this.args.package.documents,
      ...this.fileManager.filesToUpload.files,
    ];
  }

  @action
  deselectFileForUpload(file) {
    this.fileManager.deselectFileForUpload(file);

    this.args.package.documents = this.args.package.documents.filter(
      (document) => document !== file,
    );
  }

  @action
  validateFilePresence() {
    const validationResult = validateFileUpload({ message: 'One or more document uploads is required.' })(
      'documents',
      this.fileManager.filesToUpload.files,
    );

    if (validationResult !== true) {
      this.errorMessage = validationResult;
    } else {
      this.errorMessage = null;
    }
  }
}
