import { Model, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  landuseForm: belongsTo('landuse-form'),
  zoningResolution: belongsTo('zoning-resolution'),
});
