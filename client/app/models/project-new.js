import Model, { attr, belongsTo } from '@ember-data/model';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import FileManager from '../services/file-manager';

export default class ProjectNew extends Model {
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

  // Since file upload doesn't perform requests through
  // an Ember Model save() process, it doesn't automatically
  // hydrate the package.adapterError property. When an error occurs
  // during upload we have to manually hydrate a custom error property
  // to trigger the error box displayed to the user.
  @tracked
  fileUploadErrors = null;

  @service
  session;

  @service
  fileQueue;

  @belongsTo('projects', { async: false })
  projects;

  @attr('string', {
    defaultValue: '',
  })
  projectName;

  @attr('string', {
    defaultValue: '',
  })
  borough;

  @attr('string', {
    defaultValue: '',
  })
  applicantType;

  @attr('string', {
    defaultValue: '',
  })
  primaryContactFirstName;

  @attr('string', {
    defaultValue: '',
  })
  primaryContactLastName;

  @attr('string', {
    defaultValue: '',
  })
  primaryContactEmail;

  @attr('string', {
    defaultValue: '',
  })
  primaryContactPhone;

  @attr('string', {
    defaultValue: '',
  })
  applicantFirstName;

  @attr('string', {
    defaultValue: '',
  })
  applicantLastName;

  @attr('string', {
    defaultValue: '',
  })
  applicantEmail;

  @attr('string', {
    defaultValue: '',
  })
  applicantPhone;

  @attr('string', {
    defaultValue: '',
  })
  projectBrief;

  @attr('string', {
    defaultValue: () => [],
  })
  documents;

  async saveAttachedFiles(instanceId) {
    try {
      await this.fileManager.save(instanceId);
    } catch (e) {
      console.log('Error saving files: ', e); // eslint-disable-line no-console

      // See comment on the tracked fileUploadError property
      // definition above.
      this.fileUploadErrors = [
        {
          code: 'UPLOAD_DOC_FAILED',
          title: 'Failed to upload documents',
          detail:
            'An error occured while  uploading your documents. Please refresh and retry.',
        },
      ];
    }
  }
}
