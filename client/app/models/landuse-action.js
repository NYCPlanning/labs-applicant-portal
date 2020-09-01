import Model, { attr, belongsTo } from '@ember-data/model';

export default class LanduseActionModel extends Model {
  @belongsTo('landuse-form', { async: false })
  landuseForm;

  @attr dcpActioncode;

  @attr dcpPreviouslyapprovedactioncode;

  @attr dcpApplicantispublicagencyactions;
}
