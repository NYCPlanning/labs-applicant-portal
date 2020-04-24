import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

/**
  * This component creates a new File Manager specifically for
  * the passed in package. The File Manager is among one of many
  * on the the application File Manager service.
  *
  * @param      {Package Model}  package
  */
export default class PackagesAttachmentsComponent extends Component {
  @service
  fileManagement;

  get fileManager() {
    return this.fileManagement.fileManagers[this.args.packageId] ||
      this.fileManagement.createFileManager(this.args.package);
  }
}
