import Model, { attr, belongsTo } from '@ember-data/model';

export default class TeamMemberModel extends Model {
  @attr
  name;

  @attr
  role;

  @attr
  email;

  @attr
  phone;

  @belongsTo('project', { async: false })
  project;
}
