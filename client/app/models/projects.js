import Model, { belongsTo, attr } from '@ember-data/model';

export default class ProjectsModel extends Model {
  @attr('string') dcpProjectname;

  async submit() {
    await super.save();
  }
}
