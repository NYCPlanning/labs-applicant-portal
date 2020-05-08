import Model, { attr, belongsTo } from '@ember-data/model';

export default class ApplicantModel extends Model {
  @belongsTo('pas-form')
  pasForm;

  // only exists on dcp_applicantinformation CRM entity
  // either 'Applicant' or 'Authorized Applicant Representative'
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

  // indicates which table to send to crm ('Applicant' or 'Applicant Representative')
  @attr('string', {
    defaultValue: 'dcp_applicantinformation',
  })
  targetEntity;

  // derive a friendlier name for the entities to use in the UI
  get friendlyEntityName() {
    if (this.targetEntity === 'dcp_applicantinformation') {
      return 'Applicant';
    } if (this.targetEntity === 'dcp_applicantrepresentativeinformation') {
      return 'Applicant Team Member';
    } throw new Error('Invalid applicant targetEntity');
  }
}
