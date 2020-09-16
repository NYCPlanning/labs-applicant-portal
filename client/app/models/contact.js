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

  @attr
  telephone1;

  // we can use this to assume whether they have logged in once
  @attr
  dcpNycidGuid;

  // unreliable: these do not necessarily come back from the contacts
  // endpoint. do not rely on these virtual properties
  @attr('boolean', { allowNull: true })
  isNycidValidated;

  @attr('boolean', { allowNull: true })
  isNycidEmailRegistered;

  @attr('boolean', { allowNull: true })
  hasCrmContact;

  @attr('boolean', { allowNull: true })
  isCityEmployee;
}
