import Model, { attr, belongsTo } from '@ember-data/model';

export default class AffectedZoningResolutionModel extends Model {
  @belongsTo('rwcds-form')
  rwcdsForm;

  @attr
  dcpZoningresolutiontype;

  @attr
  dcpZrsectionnumber;

  @attr
  dcpModifiedzrsectionnumber;

  @attr
  dcpZrsectiontitle;
}
