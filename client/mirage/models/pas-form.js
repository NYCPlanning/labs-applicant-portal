import { Model, belongsTo, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  package: belongsTo('package'),
  bbls: hasMany('bbl'),
  applicants: hasMany('applicant'),
});
