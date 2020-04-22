import Model, { belongsTo } from '@ember-data/model';

export default class PackageModel extends Model {
  @belongsTo('pas-form')
  pasForm;
}
