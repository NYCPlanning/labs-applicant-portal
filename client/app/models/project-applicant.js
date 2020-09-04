import Model, { attr, belongsTo } from '@ember-data/model';

export default class ProjectApplicantModel extends Model {
  @attr dcpName;

  @attr emailaddress;

  @attr dcpApplicantrole;

  @attr statuscode;

  // NOTE: dcp_name field in projectApplicant entity is automatically filled with...
  // the firstname and lastname fields in the contact entity. In order to get accurate
  // firstname and lastname values, we have "fake" firstname and lastname attributes in
  // the frontend project-applicant model so we can send to backend.
  @attr firstname;

  @attr lastname;

  @belongsTo('project', { async: false })
  project;

  @belongsTo('contact', { async: false })
  contact;
}
