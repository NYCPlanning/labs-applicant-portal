import Model, { attr, belongsTo } from '@ember-data/model';

export default class ProjectApplicantModel extends Model {
  @attr dcpName;

  @attr emailaddress;

  @attr dcpApplicantrole;

  @attr statuscode;

  @belongsTo('project', { async: false })
  project;

  @belongsTo('contact', { async: false })
  contact;
}
