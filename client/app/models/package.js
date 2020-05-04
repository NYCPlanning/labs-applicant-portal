import Model, { attr, belongsTo } from '@ember-data/model';
import { inject as service } from '@ember/service';

export default class PackageModel extends Model {
  ready() {
    this.fileManager = this.fileManagement.findOrCreate(
      this.id,
      this.documents,
    );
  }

  @service
  fileManagement;

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
  versionnumber

  @attr({ defaultValue: () => [] })
  documents;

  async saveDescendants() {
    await this.fileManager.uploadFiles();
    // call special save methods because it will issue a
    // patch requests to every associated record
    await this.pasForm?.saveDirtyApplicants();
    await this.pasForm?.saveDirtyBbls();
    await this.pasForm?.save();
    await this.save();
  }
}
