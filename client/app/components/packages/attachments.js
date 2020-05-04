import Component from '@glimmer/component';
import { action } from '@ember/object';

/**
  * This component creates a new File Manager specifically for
  * the passed in package. The File Manager is among one of many
  * on the the application File Manager service.
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

  @action
  deselectFileForUpload(file) {
    this.fileManager.deselectFileForUpload(file);
  }
}
