import Model, { attr, belongsTo } from '@ember-data/model';

export default class UserModel extends Model {
  @belongsTo('project')
  project;

  @attr
  contactid;

  @attr
  emailaddress1;

  @attr
  firstname;

  @attr
  lastname;
}
