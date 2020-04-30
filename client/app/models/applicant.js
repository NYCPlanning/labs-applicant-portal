import Model, { attr } from '@ember-data/model';

export default class ApplicantModel extends Model {
  // indicates which table to send to crm ("Applicant" or "Applicant Representative")
  @attr('string')
  role;

  // doesn't exist on "Applicant Representative Information" CRM table
  @attr('string')
  applicantType;

  @attr('string') 
  firstName;

  @attr('string')
  lastName;

  @attr('string')
  organization;

  @attr('string')
  emailAddress;

  @attr('string')
  address;

  @attr('string')
  city;

  @attr('string')
  state;

  @attr('string')
  zip;

  @attr('string')
  phone;
}
