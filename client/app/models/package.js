import Model, { attr, belongsTo } from '@ember-data/model';
import { inject as service } from '@ember/service';
import FileManager from '../services/file-manager';

export default class PackageModel extends Model {
  ready() {
    const fileQueue = this.fileQueue.create(this.id);

    this.fileManager = new FileManager(
      this.id,
      this.documents,
      [],
      fileQueue,
    );
  }

  @service
  fileQueue;

  @belongsTo('project', { async: false })
  project;

  @belongsTo('pas-form', { async: false })
  pasForm;

  @attr('string')
  statuscode;

  @attr('string')
  dcpPackagetype;

  @attr('number')
  dcpVisibility;

  @attr('number')
  dcpPackageversion

  @attr({ defaultValue: () => [] })
  documents;

  async saveDescendants() {
    await this.fileManager.save();
    // call special save methods because it will issue a
    // patch requests to every associated record
    await this.pasForm?.saveDirtyApplicants();
    await this.pasForm?.saveDirtyBbls();
    await this.pasForm?.save();
    await this.save();
  }
}
