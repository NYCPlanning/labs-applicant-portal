import Model, { belongsTo } from '@ember-data/model';

export default class PasFormModel extends Model {
  @belongsTo
  package;
}
