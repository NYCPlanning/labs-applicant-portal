import Model, { attr, belongsTo } from '@ember-data/model';

export default class UserModel extends Model {
  @belongsTo('project-applicant', { async: false })
  projectApplicant;

  @attr
  emailaddress1;

  @attr
  firstname;

  @attr
  lastname;
}
