import Component from '@glimmer/component';
import { action } from '@ember/object';

/**
  * @param      {Artifact Model}  artifact
  */
export default class PackagesArtifactAttachmentsComponent extends Component {
  get fileManager() { // should be an instance of FileManager
    return this.args.fileManager;
  }

  @action
  markFileForDeletion(file) {
    this.fileManager.markFileForDeletion(file);

    this.args.artifact.documents = this.fileManager.existingFiles;
  }

  @action
  unmarkFileForDeletion(file) {
    this.fileManager.unMarkFileForDeletion(file);
  }

  @action
  trackFileForUpload() {
    this.fileManager.trackFileForUpload();

    this.args.artifact.documents = [...this.args.artifact.documents, ...this.fileManager.filesToUpload.files];
  }

  @action
  deselectFileForUpload(file) {
    this.fileManager.deselectFileForUpload(file);

    this.args.artifact.documents = this.args.artifact.documents.filter((document) => document !== file);
  }
}
