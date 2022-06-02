import { Model, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  packages: hasMany('package'),
  projectApplicants: hasMany('project-applicant'),
  teamMembers: hasMany('team-member'),
  contacts: hasMany('contact'),
});
