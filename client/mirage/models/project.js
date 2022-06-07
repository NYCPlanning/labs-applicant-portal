import { Model, hasMany, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  packages: hasMany('package'),
  projectApplicants: hasMany('project-applicant'),
  teamMembers: hasMany('team-member'),
  contacts: hasMany('contact'),
  artifact: belongsTo('artifact'),
});
