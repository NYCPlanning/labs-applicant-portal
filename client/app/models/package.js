import Model, { attr, belongsTo } from '@ember-data/model';

export default class PackageModel extends Model {
  @belongsTo('project')
  project;

  @belongsTo('pas-form', { async: false })
  pasForm;

  @attr('string')
  statuscode;

  @attr('string')
  dcpPackagetype;

  @attr('number')
  dcpVisibility;

  @attr()
  documents;

  async saveDescendants() {
    // call special save methods because it will issue a
    // patch requests to every associated record
    await this.pasForm?.saveDirtyApplicants();
    await this.pasForm?.saveDirtyBbls();
    await this.pasForm?.save();
    await this.save();
  }
}
