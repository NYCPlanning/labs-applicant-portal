import Model, { belongsTo, attr } from "@ember-data/model";

export default class ProjectsModel extends Model {

  @belongsTo('package', {async: false})
  package;

  @attr("string") dcpProjectname;
}