import Model, { belongsTo, attr } from '@ember-data/model';

export default class ProjectsModel extends Model {
  @belongsTo('package', { async: false })
  package;

  @attr('string') dcpProjectname;

  // async save() {
  //   await this.saveDirtyProject();
  //   await super.save();
  // }

  // async saveDirtyProject() {
  //   if (this.isProjectDirty) {
  //     this.package.project.save();
  //   }
  // }

  // get isProjectDirty() {
  //   // return this.package.project.hasDirtyAttributes;
  //   return true;
  // }
}
