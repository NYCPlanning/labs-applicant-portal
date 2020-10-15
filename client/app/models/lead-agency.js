import Model, { attr, belongsTo } from '@ember-data/model';

export default class LeadAgencyModel extends Model {
  @belongsTo('landuse-form', { async: false })
  landuseForm;

  @attr name;
}
