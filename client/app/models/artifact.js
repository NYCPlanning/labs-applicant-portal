import Model, { attr, belongsTo } from '@ember-data/model';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import FileManager from '../services/file-manager';

export default class ArtifactModel extends Model {
  createFileQueue() {
    if (this.fileManager) {
      this.fileManager.existingFiles = this.documents;
    } else {
      const fileQueue = this.fileQueue.create(`artifact${this.id}`);

      this.fileManager = new FileManager(
        this.id,
        'artifact',
        this.documents,
        [],
        fileQueue,
        this.session,
      );
    }
  }

  @tracked
  fileUploadErrors = null;

  @service
  session;

  @service
  fileQueue;

  @belongsTo('project', { async: false })
  project;

  @attr()
  dcpName;

  @attr({ defaultValue: () => [] })
  documents;

  get isDirty() {
    return this.fileManager && this.fileManager.isDirty;
  }

  async save() {
    this.fileUploadErrors = null;

    try {
      await this.fileManager.save();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('Error saving files: ', e);

      this.fileUploadErrors = [
        {
          code: 'UPLOAD_DOC_FAILED',
          title: 'Failed to upload artifact documents',
          detail:
            'An error occured while uploading your artifact documents. Please refresh and retry.',
        },
      ];
    }

    if (!this.fileUploadErrors) {
      this._synchronizeDocuments();
    }
  }

  _synchronizeDocuments() {
    this.fileManager.existingFiles = this.documents;
  }
}
