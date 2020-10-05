import { Model, belongsTo, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  package: belongsTo('project'),
  applicants: hasMany('applicant'),
  landuseActions: hasMany('landuse-action'),
  bbls: hasMany('bbl'),
  relatedActions: hasMany('related-action'),
  leadAgency: belongsTo('lead-agency'),
  affectedZoningResolutions: hasMany('affected-zoning-resolution'),
});
