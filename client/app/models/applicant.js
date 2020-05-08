import Model, { attr, belongsTo } from '@ember-data/model';

export default class ApplicantModel extends Model {
  @belongsTo('pas-form')
  pasForm;

  // indicates which table to send to crm ("Applicant" or "Applicant Representative")
  @attr('string', {
    defaultValue: 'Applicant',
  })
  targetEntity;

  // doesn't exist on "Applicant Representative Information" CRM table
  @attr('string')
  dcpType;

  @attr('string')
  dcpFirstname;

  @attr('string')
  dcpLastname;

  @attr('string')
  dcpOrganization;

  @attr('string')
  dcpEmail;

  @attr('string')
  dcpAddress;

  @attr('string')
  dcpCity;

  @attr('number')
  dcpState;

  @attr('string')
  dcpZipcode;

  @attr('string')
  dcpPhone;
}
