import Component from '@glimmer/component';
import { action } from '@ember/object';

/**
  * This component wires a fileManager to the attachments UI.
  * @param      {Package Model}  package
  */
export default class PackagesAttachmentsComponent extends Component {
  get fileManager() { // should be an instance of FileManager
    return this.args.fileManager;
  }

  @action
  markFileForDeletion(file) {
    this.fileManager.markFileForDeletion(file);
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
  }

  @action
  deselectFileForUpload(file) {
    this.fileManager.deselectFileForUpload(file);
  }
}
