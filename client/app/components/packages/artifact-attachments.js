import Component from '@glimmer/component';
import { action } from '@ember/object';

/**
  * @param      {Project Model}  project
  */
export default class PackagesArtifactAttachmentsComponent extends Component {
  get fileManager() { // should be an instance of FileManager
    return this.args.fileManager;
  }

  @action
  markFileForDeletion(file) {
    this.fileManager.markFileForDeletion(file);

    this.args.project.artifactDocuments = this.fileManager.existingFiles;
  }

  @action
  unmarkFileForDeletion(file) {
    this.fileManager.unMarkFileForDeletion(file);
  }

  @action
  trackFileForUpload() {
    this.fileManager.trackFileForUpload();

    this.args.project.artifactDocuments = [...this.args.project.artifactDocuments, ...this.fileManager.filesToUpload.files];
  }

  @action
  deselectFileForUpload(file) {
    this.fileManager.deselectFileForUpload(file);

    this.args.project.artifactDocuments = this.args.project.artifactDocuments.filter((document) => document !== file);
  }
}
