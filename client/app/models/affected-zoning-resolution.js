import Model, { attr, belongsTo } from '@ember-data/model';

export default class AffectedZoningResolutionModel extends Model {
  @belongsTo('rwcds-form')
  rwcdsForm;

  @belongsTo('landuse-form')
  landuseForm;

  @attr
  dcpZoningresolutiontype;

  @attr
  dcpZrsectionnumber;

  @attr
  dcpModifiedzrsectionnumber;

  @attr
  dcpZrsectiontitle;
}
