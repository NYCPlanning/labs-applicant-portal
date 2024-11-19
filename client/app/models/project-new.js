import Model, { attr } from '@ember-data/model';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import FileManager from '../services/file-manager';

export default class ProjectNew extends Model {
  createFileQueue() {
    console.debug('create project file queue', this.fileManager)
    console.debug('create project id', this.id);
    if (this.fileManager) {
      this.fileManager.existingFiles = this.documents;
    } else {
      const fileQueue = this.fileQueue.create(`package${this.id}`)

      this.fileManager = new FileManager(
        this.id,
        'package',
        this.documents,
        [],
        fileQueue,
        this.session,
      )
    }
    console.debug('created project file queue', this.fileManager);
  }

  @service
  session;

  @service
  fileQueue;

  @tracked
  fileUploadErrors = null;

  @attr({
    defaultValue: () => []
  })
  documents

  @attr('string', {
    defaultValue: ''
  })
  projectName;

  @attr('string', {
    defaultValue: ''
  })
  borough;

  @attr('string', {
    defaultValue: ''
  })
  applicantType;

  @attr('string', {
    defaultValue: ''
  })
  primaryContactFirstName;

  @attr('string', {
    defaultValue: ''
  })
  primaryContactLastName;

  @attr('string', {
    defaultValue: ''
  })
  primaryContactEmail;

  @attr('string', {
    defaultValue: ''
  })
  primaryContactPhone;

  @attr('string', {
    defaultValue: ''
  })
  applicantFirstName;

  @attr('string', {
    defaultValue: ''
  })
  applicantLastName;

  @attr('string', {
    defaultValue: ''
  })
  applicantEmail;

  @attr('string', {
    defaultValue: ''
  })
  applicantPhone;

  @attr('string', {
    defaultValue: ''
  })
  projectBrief;
}
