import { Model, belongsTo, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  project: belongsTo('project'),
  pasForm: belongsTo('pas-form'),
  rwcdsForm: belongsTo('rwcds-form'),
  landuseForm: belongsTo('landuse-form'),
  ceqrInvoiceQuestionnaires: hasMany('ceqr-invoice-questionnaire'),
});
