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
    await this.pasForm?.applicants?.save();

    // call special save method because there can be
    // 100s of bbls
    await this.pasForm?.saveDirtyBbls();
    await this.pasForm?.save();
    await this.save();
  }
}
