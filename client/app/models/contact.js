import Model, { attr, belongsTo } from '@ember-data/model';

export default class ContactModel extends Model {
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

  @attr
  dcpNycidGuid;

  @attr('boolean', { allowNull: true })
  isNycidValidated;

  @attr('boolean', { allowNull: true })
  isNycidEmailRegistered;

  @attr('boolean', { allowNull: true })
  hasCrmContact;

  @attr('boolean', { allowNull: true })
  isCityEmployee;
}
