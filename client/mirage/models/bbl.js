import { Model, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  pasForm: belongsTo('pas-form'),
  project: belongsTo('project'),
  landuseForm: belongsTo('landuse-form'),
});
