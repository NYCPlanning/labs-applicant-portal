import Model, { attr } from '@ember-data/model';

export default class UserModel extends Model {
  @attr
  contactid;

  @attr
  emailaddress1;

  @attr
  firstname;

  @attr
  lastname;
}
