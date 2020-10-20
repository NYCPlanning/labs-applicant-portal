import Model, { attr, belongsTo } from '@ember-data/model';

export default class ZoningResolutionModel extends Model {
  @belongsTo('landuse-action', { async: false })
  landuseAction;

  @attr
  dcpZoningresolution;
}
