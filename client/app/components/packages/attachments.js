import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

/**
  * This component creates a new File Manager specifically for
  * the passed in package. The File Manager is among one of many
  * on the the application File Manager service.
  * @param      {Package Model}  package
  */
export default class PackagesAttachmentsComponent extends Component {
  constructor() {
    super(...arguments);

    this.fileManager = this.fileManagement.findOrCreate(
      this.args.package.id,
      this.args.package.documents,
    );
  }

  @service
  fileManagement;

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
