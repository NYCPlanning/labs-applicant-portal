import Model, { attr, belongsTo } from '@ember-data/model';

export default class SitedatahFormModel extends Model {
  @belongsTo('landuse-form', { async: false })
  landuseForm;

  @attr dcpApplicationnumber;

  @attr dcpLanduseform;

  @attr dcpBorough;

  @attr dcpUrsitenumber;

  @attr dcpBlocknumbertext;

  @attr dcpAddress;

  @attr dcpLotnumberstring;

  @attr dcpOwner;

  @attr dcpSitenumber;

  @attr dcpBuildings;

  @attr dcpZoning;

  @attr dcpExistinguses;

  @attr dcpExistingstories;

  @attr dcpSitetobedisposed;

  @attr dcpProposeduses;

  @attr('number', { defaultValue: null })
  dcpCommoccup;

  @attr('number', { defaultValue: null })
  dcpVacant;

  @attr('number', { defaultValue: null })
  dcpNoofemp;

  @attr('number', { defaultValue: null })
  dcpDwellingcup;

  @attr('number', { defaultValue: null })
  dcpDwellingvacant;
}
