import Model, { attr, belongsTo } from '@ember-data/model';

export default class ProjectApplicantModel extends Model {
  @attr dcpName;

  @attr emailaddress;

  @attr dcpApplicantrole;

  @belongsTo('project')
  project;
}
