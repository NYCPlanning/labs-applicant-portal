import Model, { attr, belongsTo } from '@ember-data/model';

export default class RelatedActionModel extends Model {
  @belongsTo('landuse-form', { async: false })
  landuseForm;

  @attr dcpIscompletedaction;

  @attr dcpReferenceapplicationno;

  @attr dcpApplicationdescription;

  @attr dcpDispositionorstatus;

  @attr dcpCalendarnumbercalendarnumber;

  @attr dcpApplicationdate;
}
