import { Model, belongsTo, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  package: belongsTo('package'),
  affectedZoningResolutions: hasMany('affected-zoning-resolution'),
});
