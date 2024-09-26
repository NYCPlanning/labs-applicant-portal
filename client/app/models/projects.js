import Model, { belongsTo, attr } from "@ember-data/model";

export default class ProjectsFormModel extends Model {

  @belongsTo('package', {async: false})
  package;

  @attr("string") dcpProjectname;
  @attr("number") dcpBorough;
}