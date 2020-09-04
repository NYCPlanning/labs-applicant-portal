import Model, { attr, belongsTo } from '@ember-data/model';

export default class ContactModel extends Model {
  @belongsTo('project-applicant', { async: false })
  projectApplicant;

  @attr
  emailaddress1;

  @attr
  firstname;

  @attr
  lastname;

  @attr
  statuscode;

  @attr
  statecode;

  @attr('boolean', { allowNull: true })
  isNycidValidated;

  @attr('boolean', { allowNull: true })
  isNycidEmailRegistered;

  @attr('boolean', { allowNull: true })
  hasCrmContact;

  @attr('boolean', { allowNull: true })
  isCityEmployee;
}
